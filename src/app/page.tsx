'use client';
import Console from "./components/console";
import "./globals.css";
import { useEffect, useState } from 'react';
import React from "react";


export default function Home() {
  const [dialog, setDialog] = useState([]);
  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);

  function setMessage(message: any) {
    dialog.push(message);
    forceUpdate();
  }

  return (
    <section className="hero is-fullheight">
      <div className="hero-body">
        
        <div style={{width: '100%'}}>
          <article className="content" style={{ marginBottom: '7em'}}>
            {
              dialog.map( diag => (
                <p
                  dangerouslySetInnerHTML={{__html: diag.content}} 
                  className={` m-5 ${diag.role == "agent" ? 'has-text-left' : diag.role == "user" ? 'has-text-right has-text-grey' : 'has-text-centered has-text-grey-lighter'} `} key={diag.sequence}></p>
              ))
            }
          </article>
        </div>
        <div className="">
          <Console set={setMessage} />
        </div>
        
      </div>
      <div className="hero-foot"></div>
    </section>
  );
}
