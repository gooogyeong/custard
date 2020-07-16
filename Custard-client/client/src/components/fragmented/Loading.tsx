import React from "react";
import styled from "styled-components";
import { Spin } from "antd";
import "../../styles/custom-antd.css";

const SpinContainer = styled.div`
display: flex;
width: 100%;
padding: 25px 0 0 47.55%;
justify-content; space-around;
`;

export const Loading = () => (
  <SpinContainer>
    <Spin size="large" />
  </SpinContainer>
);
