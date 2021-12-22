import { Redirect, Switch, withRouter } from "react-router-dom";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import { HomeProvider } from "./context/home";
import RouteWithLayout from "./layouts";
import MainLayout from "./layouts/MainLayout";
import Coffee from "./Pages/Coffee";
import Favourite from "./Pages/Favourite";
import Home from "./Pages/Home";
import Menu from "./Pages/Menu";
import NotFound from "./Pages/NotFound";
import theme from "./theme";

/**
 * global style 
 * @type {GlobalStyleComponent<{}, DefaultTheme>}
 */
const GlobalStyle = createGlobalStyle`
  html {
    height: 100%;
  }

  body {
    display: flex;
    justify-content: center;
    align-items:center;
    min-height: 100vh;
    
    background-color: ${theme.white}
  }
  
  ul {
    padding: 0;
    margin: 0;
  }
  
  li {
    padding: 0;
    margin: 0;
  }
`;

/**
 * routing pages.
 * For global data usage, use ContentAPI Provider.
 *
 *
 * @returns {JSX.Element}
 * @constructor
 */
const App = () => {
  return (
    <>
      <HomeProvider>
        <GlobalStyle />
        <ThemeProvider theme={theme}>
          <Switch>
            <Redirect exact from="/" to="/home" />
            <RouteWithLayout path="/home" layout={MainLayout} component={Home} />
            <RouteWithLayout path="/favourite/:id" layout={MainLayout} component={Favourite} />
            <RouteWithLayout path="/favourite" layout={MainLayout} component={Favourite} />
            <RouteWithLayout path="/menu" layout={MainLayout} component={Menu} />
            <RouteWithLayout path="/coffee/:id" layout={MainLayout} component={Coffee} />
            <RouteWithLayout path="/not-found" layout={MainLayout} component={NotFound} />
            <Redirect to="/not-found" />
          </Switch>
        </ThemeProvider>
      </HomeProvider>
    </>
  );
}

export default withRouter(App);
