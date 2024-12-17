'use client';

import importIcon from '../img/import_icon.svg';
import enterIcon from '../img/enter_icon.svg';
import { useEffect, useState } from 'react';

import Slider from './slider';
import { debug } from 'console';

export default function Console({set, isLoading, setIsLoading, file, setFile}) {

  let prompt = {
    "message": "Quali sono le tecnologie in uso in questo progetto e qual è il livello necessario per poterci lavorare?",
    "directive": "Crea un elenco puntato e formattato da inserire in una pagina html."
  }

  let commands = {
    "project_type": { "message": "A quale tipologia di progetto può riferirsi questo file? Richiede una figura backend o frontend e di che livello?", directive: "Individua la tipologia progettuale"},
    "required_comp": { "message": "Riportami le competenze tecniche necessarie per poter lavorare con queste tecnologie e stima un livello.", directive: "Individua competenze" },
    "vulnerability": { "message": "Riporta per quali librerie esistono vulnerabilità note sul database CVE e riporta il livello di rischio e l'ID della vulnerabilità in una lista ordinata.", directive: "Ricerca vulnerabilità sul software" },
  }

  
  const [fileName, setFileName] = useState<string>();
  const [fileEnter, setFileEnter] = useState(false);
  const [temperature, setTemperature] = useState(0.3);
  const [uMessage, setUMessage] = useState<string>("project_type");
  const [aMessage, setAMessage] = useState<string>();
  const [sequence, setSequence] = useState(1);
  const [isOptionVisible, setOptionVisible] = useState(false);
  const [optionMessage, setOptionMessage] = useState<string>("More");

  let formData = new FormData();

  async function elaborate() {
    if (sequence > 1) {
      set({"content": commands[uMessage].directive, "sequence": sequence, "role": "user"})
    } else {
      console.log("message", commands[uMessage].directive);
      console.log("parameter", temperature)
      set({"content": commands[uMessage].directive , "sequence": sequence, "role": "user"})
    }
    try {
      setIsLoading(true);
      formData.append("file", file, file.name);
      formData.set("user_message", commands[uMessage].message + " " + prompt.directive)
      formData.set("user_temperature", temperature)

      await fetch("http://localhost:7071/api/http_trigger", {
        method: 'POST',
        body: formData
      }).then(async (res) => {
        setSequence(sequence + 1);
        let response = await res.json()
        setAMessage(response.content)
        set({"content": response.content, "sequence": sequence, "role": "agent"})
        console.log("Agent: ", response.content);
        setIsLoading(false);
      }); 
    } catch(error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  async function uploadFile (event){
    const file = event.target.files?.[0];
    if (!file) return;
    let blobUrl = URL.createObjectURL(file);
    setFile(file);
    setFileName(file.name);
    set({ content: `${file.name} uploaded`, sequence, role: 'system' });

  }

  function toggleOptions() {
    setOptionVisible(!isOptionVisible);
    if (optionMessage == "More") { setOptionMessage("Less"); }
    else setOptionMessage("More");
  }

  return (
    <div 
      className={`console ${ fileEnter ? "border-2" : "border-0"} border-dashed`}  
      onDragOver={(e) => { e.preventDefault(); setFileEnter(true); }}
      onDragLeave={(e) => { setFileEnter(false); }} 
      onDragEnd={(e) => { e.preventDefault(); setFileEnter(false); }}
      onDrop={(e) => {
        e.preventDefault();
        setFileEnter(false);
        if (e.dataTransfer.items) {
          [...e.dataTransfer.items].forEach((item, i) => {
            if (item.kind === "file") {
              const file = item.getAsFile();
              if (file) {
                let blobUrl = URL.createObjectURL(file);
                setFile(file);
                set({"content": `${file?.name} uploaded`, "sequence": sequence, "role": "system"})
                setFileName(file?.name);
              }
              console.log(`items file[${i}].name = ${file?.name}`);
            }
          });
        } else {
          [...e.dataTransfer.files].forEach((file, i) => {
            console.log(`… file[${i}].name = ${file.name}`);
          });
        }
      }}
      >
      <div className="box">
{       <div className={`info-file ${isOptionVisible != false ? 'p32' : ''}`}>
          {isOptionVisible ? (
            <div className="flex is-align-items-center">
              <div className="is-flex is-flex-grow-1"><label className='mr-3'>Creatività</label><span className='tag is-light'>{temperature}</span></div>
              <div className="is-flex-grow-3">
                <Slider temperature={temperature} setTemperature={setTemperature}></Slider>
              </div>
            </div>
              ) : <></>
          }
        </div>}
      
       <div className="level is-mobile is-align-items-flex-start">
          <div className="level-item">
            <button className="button is-link" onClick={() => document.getElementById('fileInput')?.click()}>
              <span>Upload File</span>
            </button>
            <input id="fileInput" type="file" onChange={(e) => uploadFile(e)} style={{ display: 'none' }} />
          </div>
          <div className="level-item">
            <div className="is-flex is-flex-direction-column is-align-items-center">
            <div className="control">
            <select className="input textarea-console" onChange={(e) => setUMessage(e.target.value)} >
                <option value="project_type">{commands["project_type"].directive}</option>
                <option value="required_comp">{commands["required_comp"].directive}</option>
                <option value="vulnerability">{commands["vulnerability"].directive}</option>
              </select>
{/*               <input className="input textarea-console" placeholder="Message" role="textbox" contentEditable="true" 
                onKeyDown={ (e) => {
                  if (e.key === "Enter") { setSequence(sequence+1); elaborate(); e.target.value = ''}
                }}
                onInput={(input) => { setUMessage(input.target.value); }}/> */}
{/*               <span className="icon is-small is-right">
                <img className={`c-icon ${ uMessage != "" ? "is-visible" : "is-invisible"}`} src={enterIcon.src} height="18" width="18"/>
              </span> */}
            </div>
            <div className="mt-3">
              <span className='is-size-6 has-text-grey is-underlined is-clickable' onClick={() => toggleOptions()}>{optionMessage} options</span>
            </div>
            </div>

          </div>

          <div className="level-item">
          <button type="button" className="button is-link text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
           onClick={elaborate} disabled={!file}>
              <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                <path stroke="currentColor" d="M1 5h12m0 0L9 1m4 4L9 9"/>
              </svg>
              <span className="sr-only"></span>
          </button>
          </div>
        </div>
      </div>
    </div>
  );
}
