import React, { useState, useEffect, useContext } from "react";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Button,
} from "@mui/material";
import Confetti from "react-dom-confetti";
import queryString from "query-string";
import axios from "axios";
import { Link } from "react-router-dom";

//INTERNAL IMPORT
import Style from "./page.module.css";
import { HIT_COUNT_URI, ACTIVE_CHAPTER_COUNT_URI } from "../constants/api";
import { QUIZ_PAGE_PATH, REVIEW_PAGE_PATH } from "../constants/route";
import { QuizContext } from "../context/QuizContext";
import { Wrapper } from "../components";

const QuizResultPage = () => {
  const [quizResult, setQuizResult] = useState({
    hitCount: {},
    activeCount: {},
  });
  const [activeState, setActiveState] = useState(false);
  const { queryParameter } = useContext(QuizContext);

  // ROUTING
  const { categorySeq, chapterNum } = queryString.parse(queryParameter);

  // RELATED HOOK
  const fetchQuizResult = async () => {
    const [hitCountState, activeCountState] = await Promise.all([
      axios.get(`${HIT_COUNT_URI}${queryParameter}`, { withCredentials: true }),
      axios.get(`${ACTIVE_CHAPTER_COUNT_URI}?categorySeq=${categorySeq}`, {
        withCredentials: true,
      }),
    ]);

    const hitCount = hitCountState.data.result;
    const activeCount = activeCountState.data.result;

    setQuizResult({ hitCount, activeCount });
  };

  useEffect(() => {
    fetchQuizResult();
  }, []);

  useEffect(() => {
    setActiveState(true);
  }, []);

  if (!Object.keys(quizResult).length) {
    return (
      <NotFoundPage title="퀴즈결과" message="데이터를 불러오는 중입니다..." />
    );
  }

  return (
    <Wrapper>
      <Typography>퀴즈결과</Typography>
      <Confetti active={activeState} config={confettiConfig} />

      <Wrapper.Body>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Card className={Style.gridItem}>
              <CardContent>
                <Typography variant="inherit" color="text.secondary">
                  ch.{chapterNum} 맞힌 갯수
                </Typography>
                <Typography variant="h5">
                  {quizResult.hitCount["hit_question_count"]}/
                  {quizResult.hitCount["question_count"]}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={6}>
            <Card className={Style.gridItem}>
              <CardContent>
                <Typography variant="inherit" color="text.secondary">
                  카테고리{categorySeq} 진행률
                </Typography>
                <Typography variant="h5">
                  {getPercent(
                    quizResult.activeCount["active_chapter_count"],
                    quizResult.activeCount["max_chapter"]
                  )}
                  %
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box className={Style.buttonContainer}>
          <Button component={Link} to={`${QUIZ_PAGE_PATH}${queryParameter}`}>
            다시풀기
          </Button>
          <Button component={Link} to={`${REVIEW_PAGE_PATH}${queryParameter}`}>
            리뷰
          </Button>
        </Box>
      </Wrapper.Body>
    </Wrapper>
  );
};

export default QuizResultPage;

const confettiConfig = {
  angle: 90,
  spread: 200,
  startVelocity: 30,
  elementCount: 200,
  dragFriction: 0.12,
  duration: 3000,
  width: "1rem",
  height: "1rem",
  perspective: "50rem",
  colors: [
    "var(--primary-color)",
    "var(--accent-color)",
    "var(--shadow-color)",
  ],
};

function getPercent(part, total) {
  return Math.round((part / total) * 100);
}
