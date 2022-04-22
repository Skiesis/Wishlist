import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { ApplicationState } from '../store';
import * as ListStore from '../store/List';
import { ListGroup, ListGroupItem } from 'reactstrap';

class List extends React.PureComponent<any, { selectedList: number }> {

    constructor(props: any){
        super(props);
        this.state = {
            selectedList: 0
        }
    }
    // This method is called when the component is first added to the document
    public componentDidMount() {
        this.ensureDataFetched();
    }

    public render() {
        return (
            <React.Fragment>
                <h1> Wishlists </h1>
                { this.renderLists() }
                { this.renderPagination() }
            </React.Fragment>
        );
    }

    private ensureDataFetched() {
        this.props.requestLists();
    }

    private renderLists() {
        return (
            <div>
                <ListGroup>
                    {this.props.lists.map((list: ListStore.List) => 
                        <ListGroupItem tag="button" active={ list.id === this.state.selectedList } onClick={() => this.selectList(list.id)} key={ list.id }>{ list.name }</ListGroupItem>
                    )}
                </ListGroup>
            </div>
        );
    }

    private selectList(id: number) {
        this.setState({
            selectedList: id
        });
        this.props.selectList(id);
    }

    private renderPagination() {
        return (
            <div className= "d-flex justify-content-between">
            {
                this.props.isLoading && <span>Loading...</span>
            }
            </div>
      );
    }
}

export default connect(
    (state: ApplicationState) => state.lists, // Selects which state properties are merged into the component's props
    ListStore.actionCreators // Selects which action creators are merged into the component's props
) (List as any); // eslint-disable-line @typescript-eslint/no-explicit-any
