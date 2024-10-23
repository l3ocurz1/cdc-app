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
      set({"content": prompt.message, "sequence": sequence, "role": "user"})
    }
    try {
      setIsLoading(true);
      formData.append("file", file, file.name);
      formData.set("user_message", prompt.message + " " + prompt.directive + " " + uMessage)

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
        <div className={`info-file ${fileName != undefined ? 'p32' : ''}`}>
          { fileName ? (
            <div>{fileName} <span className="tag is-warning is-light">JSON</span>
            </div>) : <></> 
          } 
        </div>
        <div className="level is-mobile">
          <div className="level-item">
            <button className="button upload">
              <span className="icon is-small"><img src={importIcon.src}/></span>
            </button>
          </div>
          <div className="level-item">
            <div className="control has-icons-right">
              <input className="input textarea-console" placeholder="Message" role="textbox" contentEditable="true" 
                onKeyDown={ (e) => {
                  if (e.key === "Enter") { setSequence(sequence+1); elaborate(); e.target.value = ''}
                }}
                onInput={(input) => { setUMessage(input.target.value); }}/>
              <span className="icon is-small is-right">
                <img className={`c-icon ${ uMessage != "" ? "is-visible" : "is-invisible"}`} src={enterIcon.src} height="18" width="18"/>
              </span>
            </div>
          </div>
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
