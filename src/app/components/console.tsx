'use client';

import importIcon from '../img/import_icon.svg';
import enterIcon from '../img/enter_icon.svg';
import { useEffect, useState } from 'react';
import type { NextApiRequest, NextApiResponse } from 'next'
import { Puff } from "react-loader-spinner";

export default function Console({set}) {

  const CLASS_FADE_IN = "fade-in";
  const CLASS_FADE_OUT = "fade-out";
  let prompt = {
    "message": "Quali sono le tecnologie in uso in questo progetto e qual è il livello necessario per poterci lavorare?",
    "directive": "Dammi il risultato come elenco puntato formattato per inserirlo in una pagina html."
  }

  const [file, setFile] = useState<string>();
  const [fileName, setFileName] = useState<string>();
  const [fileEnter, setFileEnter] = useState(false);
  const [parameter, setParam] = useState(50);
  const [uMessage, setUMessage] = useState<string>();
  const [aMessage, setAMessage] = useState<string>();
  const [sequence, setSequence] = useState(1);
  const [isLoading, setIsLoading] = useState(false);


  function fadeIn() {
    const consoleEl = document.querySelector(".console-message")
    consoleEl?.classList.remove(CLASS_FADE_OUT);
    consoleEl?.classList.add(CLASS_FADE_IN);
    
  }

  function fadeOut() {
    const consoleEl = document.querySelector(".console-message")
    consoleEl?.classList.add(CLASS_FADE_OUT);
    consoleEl?.classList.remove(CLASS_FADE_IN);
  }

  let formData = new FormData();

  async function elaborate() {
    if (sequence > 1) {
      set({"content": uMessage, "sequence": sequence, "role": "user"})
    } else {
      console.log("message", uMessage);
      console.log("parameter", parameter)
      set({"content": uMessage? uMessage : prompt.message , "sequence": sequence, "role": "user"})
    }
    try {
      setIsLoading(true);
      formData.append("file", file, file.name);
      formData.set("user_message", prompt.message + " " + prompt.directive + " " + uMessage)
      formData.set("param1", String(parameter))

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
{/*       <div className={`info-file ${fileName != undefined ? 'p32' : ''}`}>
          { fileName ? (
            <div>{fileName} <span className="tag is-warning is-light">JSON</span>
            </div>) : <></> 
          } 
      </div> */}
      {fileName ? (<div className="level is-mobile">
        <label>Creatività Risposta</label>
        <div className="flex items-center space-x-2">
          <input
            type="range"
            min="0"
            max="100"
            value={parameter}
            onChange={(e) => setParam(e.target.value)}
            className="w-full h-1 bg-gray-300 rounded appearance-none cursor-pointer"
          />
          <span className="text-gray-800 text-xs">{parameter}</span>
        </div>
      </div>) : <></>
       }
       <div className="level is-mobile">
          <div className="level-item">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => document.getElementById('fileInput')?.click()}>
              <span>Upload File</span>
            </button>
            <input id="fileInput" type="file" onChange={(e) => uploadFile(e)} style={{ display: 'none' }} />
          </div>
          <div className="level-item">
            <div className="control">
            <select className="input textarea-console" onChange={(e) => setUMessage(e.target.value)}>
                <option value="">Seleziona un opzione</option>
                <option value="Analizza il file">Analizza il file</option>
                <option value="Dimmi che tipo di progetto è">Dimmi che tipo di progetto è</option>
                <option value="Tecnologie Utilizzate">Tecnologie Utilizzate</option>
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
          </div>
          <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
           onClick={elaborate} disabled={!file}>
              <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                <path stroke="currentColor" d="M1 5h12m0 0L9 1m4 4L9 9"/>
              </svg>
              <span className="sr-only">Icon description</span>
          </button>
          <div className="level-item">
          <Puff 
            height="32"
            width="32"
            wrapperClass={`m-auto ${isLoading ? '': 'is-invisible'}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
