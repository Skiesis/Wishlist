import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store';
import * as ListStore from '../../store/List';
import { Button, Input, InputGroup, InputGroupText, ListGroup, ListGroupItem, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

class ListModal extends React.PureComponent<any, any> {
    
    constructor(props: any) {
        super(props);
        this.state = {
            modal: false,
            list: {
                name: ''
            }
        }
    }
    
    public componentDidMount() {
        this.setState({
            modal: this.props.modal,
            list: this.props.list 
        })
    }

    public componentDidUpdate() {
        if(this.props.modal && this.props.modal !== this.state.modal) this.setState({
            ...this.state,
            modal: this.props.modal,
        })
        
        if(this.props.list && this.props.list.id !== this.state.list.id){            
            this.setState({
                ...this.state,
                list: this.props.list,
            })
        }
    }

    public render() {
        return (
            <Modal centered isOpen={this.state.modal} toggle={() => this.toggle()}>
                <ModalHeader toggle={() => this.toggle()}>
                    { this.props.list.id ? 'Edit' : 'Add' } List 
                </ModalHeader>
                <ModalBody>
                    <InputGroup className="py-3">
                        <InputGroupText>
                            Name
                        </InputGroupText>
                        <Input placeholder='Name' name="name" value={ this.state.list.name } onChange={(e) => this.handleChange(e)} />
                    </InputGroup>
                </ModalBody>
                <ModalFooter>
                    {this.renderEraseButton()}
                    <Button color='primary' disabled={ !this.state.list.name || this.props.isLoading } onClick={() => this.saveList()}>
                        Save
                    </Button>
                </ModalFooter>
            </Modal>
        );
    }

    private renderEraseButton(){
        if(this.props.list.id) 
            return (
                <div className="delete-button">
                    <Button color="danger" onClick={() => this.eraseList()}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#FFFFFF"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                    </Button>
                </div>
            )
    }

    private eraseList(){
        if(confirm(`Are your sure you want to delete List '${this.state.list.name}' and its items?`)){
            this.props.deleteList(this.state.list.id);
            this.props.selectList({});
            this.toggle();
        }
    }

    private handleChange(event: any){        
        this.setState({
            ...this.state,
            list: {
                ...this.state.list, 
                [event.target.name]: event.target.value
            }
        })
    }

    private toggle() {
        this.setState({
            ...this.state,
            modal: !this.state.modal
        });
        this.props.setModal();
    }

    private saveList() {
        this.props.list.id ? this.props.updateList(this.state.list) : this.props.insertList(this.state.list);
        this.toggle();
    }
}

export default connect(
    (state: ApplicationState) => state.lists, // Selects which state properties are merged into the component's props
    ListStore.actionCreators // Selects which action creators are merged into the component's props
) (ListModal as any); // eslint-disable-line @typescript-eslint/no-explicit-any