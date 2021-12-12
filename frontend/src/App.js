import styled from "styled-components";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Game from "./Game";
import { NavLink } from "react-router-dom";
import BG_SRC from "./images/background.jpg";
export const StyledLink = styled(NavLink)`
  text-decoration: none;
  color: yellow;
  font-size: 24px;
  border: 2px solid yellow;
  border-radius: 32px;
  padding: 10px 40px;
  transform: scale(1);
  transition: all 0.6s;
  &:hover {
    color: blue;
    border-color: blue;
    transform: scale(1.05);
  }
`;

const NavBar = styled.main`
  height: 100vh;
  width: 100vw;
  background-image: url(${BG_SRC});
  background-repeat: no repeat;
  background-size: 100% 100%;
  display: flex;
  gap: 50px;
  justify-content: center;
  align-items: center;
`;
const Home = () => (
  <NavBar>
    <StyledLink to="/multi" exact>
      MultiPlayer Game
    </StyledLink>
    <StyledLink to="/single">SinglePlayer Game</StyledLink>
  </NavBar>
);
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/multi" element={<Game />} />
        <Route path="/single" element={<Game />} />
      </Routes>
    </Router>
  );
};

export default App;
