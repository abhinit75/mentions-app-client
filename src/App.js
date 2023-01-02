import logo from "./logo.svg";
import "./App.css";
import React from "react";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Button, Badge, Pane } from "evergreen-ui";
import ReactDOMServer from "react-dom/server";

let URL = process.env.ENV != "dev" ? process.env.URL : "http://localhost:3000/";
console.log(URL);

const MentionTextBox = () => {
  const [text, setText] = useState("");
  const [updatedMention, setUpdatedMention] = useState("");
  const [mentions, setMentions] = useState([]);
  const [selectionStart, setSelectionStart] = useState(0);
  const [selectionEnd, setSelectionEnd] = useState(0);
  const textareaRef = useRef(null);

  useEffect(() => {
    const searchMentions = async () => {
      const queryMatch = text.match(/@(\S+)/);
      if (queryMatch) {
        const query = queryMatch[0].slice(1);
        // const results = await axios.get(`http://localhost:3000/search`, {
        //   params: {
        //     q: query.toLowerCase(),
        //   },
        // });
        const response = await fetch(
          `https://mentions-app-client.onrender.com/search?q=${query.toLowerCase()}`,
          {
            method: "GET", // *GET, POST, PUT, DELETE, etc.
            mode: "same-origin", // no-cors, *cors, same-origin
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
              "Content-Type": "application/json",
            },
            referrerPolicy: "no-referrer",
          }
        );
        const results = await response.json();
        setMentions(results);
      } else {
        setMentions([]);
      }
    };
    searchMentions();
  }, [text]);

  useEffect(() => {}, [updatedMention]);

  const handleTextareaChange = (event) => {
    setText(event.target.value);
    setSelectionStart(event.target.selectionStart);
    setSelectionEnd(event.target.selectionEnd);
  };

  const handleSelectChange = (mention) => {
    const atSymbolIndex = text.lastIndexOf("@", selectionStart);
    const newText =
      text.substring(0, atSymbolIndex) +
      mention._source.name +
      text.substring(selectionEnd);
    setText(newText);
    setSelectionStart(atSymbolIndex + mention._source.name.length);
    setSelectionEnd(atSymbolIndex + mention._source.name.length);
  };

  return (
    <div>
      <textarea
        className="text-area"
        id="textarea"
        value={text}
        ref={textareaRef}
        onChange={handleTextareaChange}
      />
      <div className=".scrollable-select">
        <ul className="select" value="">
          {mentions.map((mention) => (
            <li
              onClick={() => handleSelectChange(mention)}
              value={mention._source.name}
            >
              <div>
                {mention._source.name}
                <Pane>
                  {mention._source.type == "Customer" ? (
                    <Badge color="red" marginRight={8}>
                      {mention._source.type}
                    </Badge>
                  ) : (
                    <Badge color="blue" marginRight={8}>
                      {mention._source.type}
                    </Badge>
                  )}
                </Pane>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

function App() {
  return (
    <div>
      <header></header>
      <body className="body">
        <div>
          <h1>React Mentions Style Box</h1>
          <p>
            This text box uses the elastic search to provide sreach results for
            mentions.
          </p>
        </div>
        <div>{MentionTextBox()}</div>
      </body>
    </div>
  );
}

export default App;
