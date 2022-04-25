import * as React from 'react';
import { Container } from 'reactstrap';

export default class Layout extends React.PureComponent<{}, { children?: React.ReactNode }> {
    public render() {
        return (
            <React.Fragment>
                <header className="p-4 pl-6 ">
                    <svg xmlns="http://www.w3.org/2000/svg" height="35px" viewBox="0 0 24 24" width="35px" fill="#FFFFFF"><path d="M0 0h24v24H0z" fill="none"/><path d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z"/></svg>
                    <h1 className="ml-3">Wishlists</h1>
                </header>
                <Container className="mt-5">
                    {this.props.children}
                </Container>
            </React.Fragment>
        );
    }
}