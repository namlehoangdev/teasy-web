import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import {Provider} from 'react-redux';
import {
    MainPage,
    CreateQuestionPage,
    CreateContestPage,
    CreateTestPage,
    EditContestPage,
    EditQuestionPage,
    EditTestPage,
    AdminContestsPage,
    AdminQuestionsPage,
    AdminTestsPage
} from './pages';
import {history, store} from './configurations';
import * as serviceWorker from './serviceWorker';
import './index.scss';

function AdminSwitch() {
    return (<Switch>
        <Route path="/create/question" component={CreateQuestionPage}/>
        <Route path="/create/test" component={CreateTestPage}/>
        <Route path="/create/contest" component={CreateContestPage}/>
        <Route path="/edit/question" component={EditQuestionPage}/>
        <Route path="/edit/test" component={EditTestPage}/>
        <Route path="/edit/contest" component={EditContestPage}/>
        <Route path="/questions" component={AdminQuestionsPage}/>
        <Route path="/tests" component={AdminTestsPage}/>
        <Route path="/contests" component={AdminContestsPage}/>
    </Switch>)
}

function PlayGroundSwitch() {
    return (<Switch>
        <Route path="/" component={<div/>}/>
    </Switch>)
}


ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter history={history}>
            <Switch>
                <Route exact path="/" component={MainPage}/>
                <Route exact path="/admin/" component={AdminSwitch}/>
                <Route exact path="/playground/" component={PlayGroundSwitch}/>
            </Switch>
        </BrowserRouter>
    </Provider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

