import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { Link as RouterLink } from "react-router-dom";
import Link from "@material-ui/core/Link";

import Button from "@material-ui/core/Button";
// import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import Grid from "@material-ui/core/Grid";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import AddRoundedIcon from "@material-ui/icons/AddRounded";
import RemoveRoundedIcon from "@material-ui/icons/RemoveRounded";
import FlareIcon from "@material-ui/icons/Flare";
import Bookmark from "@material-ui/icons/BookmarkBorder";

import "../styles/Score.css";

@inject((stores) => ({
  deckStore: stores.rootStore.deckStore,
  cardStore: stores.rootStore.cardStore,
}))
@observer
class Score extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hintedClicked: false,
      markedClicked: false,
    };
  }
  handleHintedButton() {
    this.setState({ hintedClicked: true });
  }
  handleMarkedButton() {
    this.setState({ markedClicked: true });
  }

  render() {
    const { deckKey } = this.props.match.params;
    const {
      currStudyCover,
      currStudyCorrect,
      currStudyWrong,
    } = this.props.cardStore;
    return (
      <div id="score">
        <div>
          <Grid container spacing={2} className="score_container">
            <Grid xs={12} sm={12} md={12} className="score_header">
              <h2>Study Stats</h2>
            </Grid>
            <Grid xs={6} sm={6} md={6}>
              <List className="score_list">
                <ListItem>
                  <ListItemIcon>
                    <AddRoundedIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={`Correct: ${currStudyCorrect} / ${currStudyCover}`}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <RemoveRoundedIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={`Wrong: ${currStudyWrong} / ${currStudyCover}`}
                  />
                </ListItem>
              </List>
            </Grid>
          </Grid>
          <br></br>
          <br></br>
          <Grid container spacing={1}>
            <Grid xs={12} sm={12} md={12}>
              <Link component={RouterLink} to={`/deck/${deckKey}`}>
                <Button variant="outlined" className="score_button">
                  Back to Deck
                </Button>
              </Link>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}

export default Score;
