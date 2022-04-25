import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { ApplicationState } from '../../store';
import * as ListItemStore from '../../store/ListItem';
import { Card, CardBody, CardText, CardTitle, ListGroup, ListGroupItem } from 'reactstrap';
import ListItemModal from './ListItemModal';

class ListItems extends React.PureComponent<any, any> {

    constructor(props: any){
        super(props);
        this.state = {
            editItem: {
                listId: this.props.list.id
            },
            modal: false
        }
    }
    // This method is called when the component is first added to the document
    public componentDidMount() {
        this.ensureDataFetched();
    }

    public componentDidUpdate() {
        this.ensureDataFetched();
        if(this.props.list.id && this.props.list.id !== this.state.editItem.listId) this.setState({
            ...this.state,
            editItem: {
                listId: this.props.list.id
            }
        })
    }

    public render() {
        const ModalProps = {
            item: this.state.editItem,
            modal: this.state.modal,
            setModal: this.setModal.bind(this)
        }        

        return (
            <React.Fragment>
                <div className='row'>
                    <h3 className='mr-5 ml-3'>Items </h3>
                    <div className='align-items-center flex-row justify-content-center row'>
                        <button 
                            className='btn btn-outline-info btn-sm rounded-pill' 
                            disabled={!this.props.list} 
                            onClick={() => this.addItem()}
                        >+ Add</button>
                    </div>
                </div>
                <div>
                    {
                        this.props.listItems.map((item: ListItemStore.ListItem ) => 
                            <div key={item.id} className='my-3'>
                                <Card 
                                    onClick={(e) => this.clickItem(e, item)}
                                >
                                    <CardBody className="rounded">
                                        <div className="row">
                                            <div className="align-content-center image-container justify-content-center row">
                                                <div className="image rounded">
                                                    {this.renderImage(item)}
                                                </div>
                                            </div>
                                            <div>
                                                <CardTitle tag="h5">
                                                    { item.name }
                                                </CardTitle>
                                                <CardText>
                                                    { item.description }
                                                </CardText>

                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            </div>
                        )
                    }
                </div>
                <ListItemModal {...ModalProps} />
                {this.renderLoading()}
            </React.Fragment>
        );
    }

    private renderImage(item: any){
        if(item.image) 
            return (
                <img src={`data:image/jpeg;base64,${item.image}`}></img>
            )
    }

    private addItem(){
        this.setState({
            ...this.state,
            editItem: {
                name: '',
                description: '',
                image: '',
                listId: this.props.list.id
            },
        }, () => {
            this.setModal();
        })
    }

    private clickItem(event: any, item: ListItemStore.ListItem){
        switch(event.detail){
            case 2: 
                this.setState({
                    ...this.state,
                    editItem: item
                }, () => {
                    this.setModal();
                })
                break;
            default: 
                return;
        }
    }

    private setModal() {
        this.setState({
            ...this.state, 
            modal: !this.state.modal
        })
    }

    private ensureDataFetched() {
        this.props.requestListItems(this.props.list.id);
    }

    private renderLoading() {
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
    (state: ApplicationState) => state.listItems, // Selects which state properties are merged into the component's props
    ListItemStore.actionCreators // Selects which action creators are merged into the component's props
) (ListItems as any); // eslint-disable-line @typescript-eslint/no-explicit-any
