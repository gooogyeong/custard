import React, { Component, useState, useEffect } from "react";
import { inject, observer } from "mobx-react";
import "tui-image-editor/dist/tui-image-editor.css";
import ImageEditor from "@toast-ui/react-image-editor";
//import Button from "react-bootstrap/Button";
import { createWorker } from "tesseract.js";
import { Editor } from "@toast-ui/react-editor";
import SelectLanguage from "./SelectLanguage.js";
import TextEditor from "./TextEditor";
import MultipleImageUpload from "./MultipleImageUpload";
import "../../styles/Detect_text_image.css";

import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";

const icona = require("tui-image-editor/dist/svg/icon-a.svg");
const iconb = require("tui-image-editor/dist/svg/icon-b.svg");
const iconc = require("tui-image-editor/dist/svg/icon-c.svg");
const icond = require("tui-image-editor/dist/svg/icon-d.svg");

const myTheme = {
  "menu.backgroundColor": "white",
  "common.backgroundColor": "#151515",
  "downloadButton.backgroundColor": "white",
  "downloadButton.borderColor": "white",
  "downloadButton.color": "black",
  "menu.normalIcon.path": icond,
  "menu.activeIcon.path": iconb,
  "menu.disabledIcon.path": icona,
  "menu.hoverIcon.path": iconc,
};

@inject((stores) => ({
  cardStore: stores.rootStore.cardStore,
}))
@observer
class Detect_text_image extends Component {
  constructor(props) {
    super(props);
    this.state = {
      worker: null,
      fileObj: [],
      fileArray: [],
      cardBin: [],
      currentImg: "",
      language: ["jpn", "eng"],
      ocr: "",
      imageSrc: "",
      OCRResult: "",
    };
    this.imageEditor = React.createRef();
    this.uploadMultipleFiles = this.uploadMultipleFiles.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.discardFile = this.discardFile.bind(this);
    this.selectFile = this.selectFile.bind(this);
    this.displayFile = this.displayFile.bind(this);
    this.selectLang = this.selectLang.bind(this);
    this.saveChange = this.saveChange.bind(this);
    this.doOCR = this.doOCR.bind(this);
    this.handleDetect = this.handleDetect.bind(this);
    this.editOCRResult = this.editOCRResult.bind(this);
  }

  uploadMultipleFiles(e) {
    const newFileObj = [...this.state.fileObj];
    for (let i = 0; i < e.target.files.length; i++) {
      newFileObj.push(e.target.files[i]);
    }
    this.setState({ fileObj: newFileObj });
    const newFileArray = [];
    for (let i = 0; i < newFileObj.length; i++) {
      newFileArray.push(URL.createObjectURL(newFileObj[i]));
    }
    this.setState({ fileArray: newFileArray });
  }

  handleCheck(i, e) {
    const newCardBin = [...this.state.cardBin];
    if (e.target.checked) {
      newCardBin.push(i);
    } else {
      for (let j = 0; j < newCardBin.length; i++) {
        if (newCardBin[j] === i) {
          newCardBin.splice(j, 1);
        }
      }
    }
    this.setState({ cardBin: newCardBin });
  }

  discardFile() {
    const oldFileObj = [...this.state.fileObj];
    const newFileObj = [];
    const newFileArray = [];
    for (let i = 0; i < oldFileObj.length; i++) {
      if (this.state.cardBin.includes(i)) {
        oldFileObj[i] = null;
      }
    }
    for (let i = 0; i < oldFileObj.length; i++) {
      if (oldFileObj[i]) {
        newFileObj.push(oldFileObj[i]);
      }
    }
    for (let i = 0; i < newFileObj.length; i++) {
      newFileArray.push(URL.createObjectURL(newFileObj[i]));
    }
    this.setState({
      fileObj: newFileObj,
      fileArray: newFileArray,
      cardBin: [],
    });
  }

  selectFile(i, e) {
    var file = this.state.fileObj[i];
    this.displayFile(file, i);
  }

  displayFile(file, i) {
    const imageEditorInst = this.imageEditor.current.getInstance();
    imageEditorInst.loadImageFromFile(file);
  }

  selectLang(langArr) {
    this.setState({ language: langArr });
  }

  dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  saveChange() {
    const imageEditorInst = this.imageEditor.current.imageEditorInst;
    console.log(imageEditorInst);
    const fileName = imageEditorInst._graphics.imageName;
    const data = imageEditorInst.toDataURL();
    let file;
    if (data) {
      const mimeType = data.split(";")[0];
      const extension = data.split(";")[0].split("/")[1];
      file = this.dataURLtoFile(data, `${fileName.split(".")[0]}.${extension}`);
    }
    console.log(file);
    const newFileObj = [...this.state.fileObj];
    const newFileArray = [...this.state.fileArray];
    for (let i = 0; i < newFileObj.length; i++) {
      if (newFileObj[i].name === fileName) {
        newFileObj[i] = file;
        newFileArray[i] = URL.createObjectURL(file);
      }
    }
    this.setState({ fileObj: newFileObj });
    this.setState({ fileArray: newFileArray });
  }

  toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  //TODO: create separate card / create one card 나눠야함
  doOCR = async () => {
    this.setState({ ocr: "Retrieving OCR result..." });
    const promises = this.state.fileObj.map(
      async function (fileObj, i) {
        if (this.state.cardBin.includes(i)) {
          const dataURL = await this.toBase64(fileObj);
          const {
            data: { text },
          } = await this.state.worker.recognize(dataURL);
          return text;
        }
      }.bind(this)
    );
    return Promise.all(promises)
      .then((res) => {
        this.setState({ OCRResult: res });
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  handleDetect(imageText) {
    console.log("imageText_addCard: ", imageText);
    this.setState({ OCRResult: imageText });
  }

  editOCRResult(e) {
    this.setState({ OCRResult: e.target.value });
  }

  async componentDidMount() {
    let targetLang = "";
    if (this.state.language.length === 1) {
      targetLang = this.state.language[0];
    } else if (this.state.language.length > 1) {
      targetLang = this.state.language.join("+");
    }
    const worker = createWorker({
      logger: (m) => console.log(m),
    });
    await worker.load(); // loads tesseract.js-core scripts
    await worker.loadLanguage(targetLang);
    await worker.initialize(targetLang); // initializes the Tesseract API
    this.setState({ worker: worker });
  }

  render() {
    //     const instruction = `1. copy & paste table
    //     2. respectively name columns question, answer, target`;
    //     const template = `| question | answer | note |
    // | -------- | ------ | ---- |
    // |  |  |  |`;
    //["blob:http://localhost:3000/a8984720-e245-4473-97ad-a729f87302a6", {...s}]
    const { detectText } = this.props.cardStore;
    return (
      <div>
        <div>
          <div id="image-editor">
            <ImageEditor
              ref={this.imageEditor}
              includeUI={{
                loadImage: {
                  path:
                    "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", //this.state.imageSrc,
                  name: "Blank", //"image"
                },
                theme: myTheme,
                //sets the menu in the toolbar
                menu: [
                  "crop",
                  "flip",
                  "rotate",
                  "draw",
                  "shape",
                  "text",
                  "filter",
                ],
                //We set initMenu to an empty string so that it won’t show any dialog when user load the image
                initMenu: "",
                uiSize: {
                  height: `calc(100vh - 160px)`,
                },
                menuBarPosition: "top",
              }}
              //sets the size of the image editor
              cssMaxHeight={window.innerHeight}
              cssMaxWidth={window.innerWidth}
              selectionStyle={{
                cornerSize: 20,
                rotatingPointOffset: 70,
              }}
              usageStatistics={true}
            />
          </div>
          {/*<DeleteIcon onClick={this.discardFile} />*/}
          <div id="MultipleImageUpload">
            <MultipleImageUpload
              fileArray={this.state.fileArray}
              uploadMultipleFiles={this.uploadMultipleFiles}
              handleCheck={this.handleCheck}
              selectFile={this.selectFile}
              displayFile={this.displayFile}
            />
          </div>
          <div id="detect-text-filler"></div>
          <div id="OCR-tool">
            <button
              id="save-change"
              className="upload-button button"
              onClick={this.saveChange}
            >
              save change
            </button>
            <button
              id="detect-change"
              className="upload-button"
              onClick={/*detectText*/ this.doOCR}
            >
              detect selected item(s)
            </button>
          </div>
          <textarea
            id="OCR-result"
            onChange={this.editOCRResult}
            value={this.state.OCRResult || this.state.ocr}
            style={{
              //width: "100%",
              height: 250,
            }}
          ></textarea>
          {/*</div>*/}
        </div>
        {/*<div id="select-language" style={{ border: "1px solid black" }}>
          <SelectLanguage
            language={this.state.language}
            selectLang={this.selectLang}
            style={{ border: "1px solid black" }}
          />
          </div>*/}
      </div>
    );
  }
}
export default Detect_text_image;
