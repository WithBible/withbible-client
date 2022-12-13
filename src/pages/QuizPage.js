import React, { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import { Typography } from "@mui/material";
import queryString from "query-string";

//INTERNAL IMPORT
import {
  ButtonBox,
  OptionList,
  QuestionBox,
  StepperBar,
  Wrapper,
} from "../components";
import { QuizContext } from "../context/QuizContext";

const QuizPage = () => {
  const { quiz, fetchQuiz, totalStep } = useContext(QuizContext);
  const [activeStep, setActiveStep] = useState(0);
  const queryParameter = useLocation().search;
  const { categorySeq, chapterNum } = queryString.parse(queryParameter);

  useEffect(() => {
    fetchQuiz({});
  }, [categorySeq, chapterNum]);

  // LOADING UI
  if (!quiz.length) {
    return (
      <Wrapper>
        <Typography>
          카테고리{categorySeq} ch. {chapterNum}
        </Typography>

        <Wrapper.Body>
          <h3>데이터를 불러오는 중입니다...</h3>
        </Wrapper.Body>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Typography>
        카테고리{categorySeq} ch. {chapterNum}
      </Typography>

      <StepperBar
        iteratee={quiz}
        activeStep={activeStep}
        setActiveStep={setActiveStep}
      />

      <Wrapper.Body>
        <QuestionBox question={quiz[activeStep]["question"]} />

        <OptionList
          questionSeq={quiz[activeStep]["question_seq"]}
          iteratee={quiz[activeStep]["option_array"]}
        />

        <ButtonBox
          isFirst={activeStep === 0}
          isLast={activeStep === totalStep()}
          setActiveStep={setActiveStep}
        />
      </Wrapper.Body>
    </Wrapper>
  );
};

export default QuizPage;
