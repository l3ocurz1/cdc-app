'use client';
import Console from "./components/console";
import "./globals.css";
import { useEffect, useState } from 'react';
import React from "react";
import { Puff } from "react-loader-spinner";

export default function Home() {
  const [dialog, setDialog] = useState([]);
  const [, updateState] = React.useState();
  const [isLoading, setIsLoading] = useState(false);
  const forceUpdate = React.useCallback(() => updateState({}), []);
  const [file, setFile] = useState<string>();

  function setMessage(message: any) {
    dialog.push(message);
    forceUpdate();
  }

  return (
    <section className="hero is-fullheight">
      <div className="hero-head">
        <div className="section level ">
          <div className="level-left"></div>
          <div className="level-right">
            <div className="level-item is-clickable">
              <button type="button">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
              </svg>
              </button>
              
            </div>
          </div>
        </div>

      </div>
      <div className="hero-body">

        <div style={{ width: '100%' }}>
          <article className="content has-text-centered" style={{ marginBottom: '15em' }}>
            {
              dialog.map(diag => (
                <p
                  dangerouslySetInnerHTML={{ __html: diag.content }}
                  className={`m-5 ${diag.role == "agent" ? 'box agent has-text-left' : diag.role == "user" ? 'box dialog-right has-text-grey' : 'tag is-light is-primary-color p-3 has-text-centered has-text-grey-lighter'} `} key={diag.sequence}>

                    
                  </p>
              ))
            }
            <div className="has-text-centered">
            {
              file == null ? <div className="hero is-small">
                <div className="is-size-4 has-text-left has-text-grey-lighter">
                  <h1 className="title is-size-3 is-primary-color">Agent Instructions</h1>
                1. Drag and Drop an XML or JSON file in the console above<br/>
                2. Choose a command <br/>
                3. Wait for the agent <br/>
                </div>
                </div> : <></>
            }      
              <Puff
                height="32"
                width="32"
                wrapperClass={`m-auto is-justify-content-center mb-5 ${isLoading ? '' : 'is-invisible'}`}
              />
            </div>

          </article>
        </div>
        <div className="">
          <Console set={setMessage} isLoading={isLoading} setIsLoading={setIsLoading} file={file} setFile={setFile} />
        </div>

      </div>
      <div className="hero-foot">
        <div className="footer">
          <div className="level">
            <div className="level-left">
              <p>CDC Nexi Digital 25 - FaaS</p>
            </div>
            <div className="level-right">
              <p>Ciurlia &#x2022; Valenziano &#x2022; Curzi</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
