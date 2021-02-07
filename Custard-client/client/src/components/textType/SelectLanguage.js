import React from "react";
import styled from "styled-components";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
//import ListItemText from "@material-ui/core/ListItemText";
import Select from "@material-ui/core/Select";
//import Checkbox from "@material-ui/core/Checkbox";
import Chip from "@material-ui/core/Chip";
import "../../styles/SelectLanguage.css";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300,
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  chip: {
    margin: 2,
  },
  noLabel: {
    marginTop: theme.spacing(3),
  },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

//"chi_sim" = 간자체, "chi_tra" = 정자체
//tesseract에서 지원하는 전체 언어: https://github.com/tesseract-ocr/tesseract/blob/master/doc/tesseract.1.asc#LANGUAGES
// cf. "equ" = math / equation detection mode
const LANG = [
  "ara",
  "ces",
  "chi_sim",
  "chi_tra",
  "deu",
  "eng",
  "fra",
  "ita",
  "jpn",
  "kor",
  "spa",
];

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const SelectLangContainer = styled.div`
  margin: 0px 0 0 250px;
`;

export default function MultipleSelect(props) {
  const classes = useStyles();
  const theme = useTheme();
  const [selectedLang, selectLang] = React.useState(["eng", "jpn"]);

  const handleChange = (e) => {
    selectLang(e.target.value);
    props.selectLang(e.target.value);
  };

  const handleChangeMultiple = (event) => {
    const { options } = event.target;
    const value = [];
    for (let i = 0, l = options.length; i < l; i += 1) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }
    selectLang(value);
  };

  return (
    <SelectLangContainer>
      <div>
        <FormControl className={classes.formControl}>
          <InputLabel id="demo-mutiple-chip-label">language</InputLabel>
          <Select
            style={{ border: "1px solid black" }}
            labelId="demo-mutiple-chip-label"
            id="demo-mutiple-chip"
            multiple
            value={props.language /*selectedLang*/}
            onChange={handleChange}
            input={<Input id="select-multiple-chip" />}
            renderValue={(selected) => (
              <div className={classes.chips}>
                {selected.map((value) => (
                  <Chip key={value} label={value} className={classes.chip} />
                ))}
              </div>
            )}
            MenuProps={MenuProps}
          >
            {LANG.map(function (lang) {
              return (
                <option /*MenuItem*/
                  key={lang}
                  value={lang}
                  style={getStyles(lang, selectedLang, theme)}
                >
                  {lang}
                </option>
              );
            })}
          </Select>
        </FormControl>
      </div>
      <div id="language-guide">choose maximum 2 dominant languages</div>
    </SelectLangContainer>
  );
}
