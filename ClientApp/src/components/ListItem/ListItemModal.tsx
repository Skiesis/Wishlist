import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store';
import * as ListItemStore from '../../store/ListItem';
import { Button, Input, InputGroup, InputGroupText, Label, ListGroup, ListGroupItem, Media, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

class ListItemModal extends React.PureComponent<any, any> {
    
    constructor(props: any) {
        super(props);
        this.state = {
            modal: false,
            item: {
                name: '',
                description: '',
                image: '',
                listId: ''
            }
        }
    }
    
    public componentDidMount() {       
        this.setState({
            modal: this.props.modal,
            item: this.props.item 
        })
    }

    public componentDidUpdate() {
        if(this.props.modal && this.props.modal !== this.state.modal) this.setState({
            ...this.state,
            modal: this.props.modal,
        })

        if(this.props.item.listId && this.props.item.listId !== this.state.item.listId) {
            
            this.setState({
                ...this.state,
                item: {
                    ...this.state.item,
                    listId: this.props.item.listId
                }
            })
        }

        if(this.props.item && this.props.item.id !== this.state.item.id) {
            
            this.setState({
                ...this.state,
                item: this.props.item
            })
        }
    }


    public render() {
        return (
            <Modal 
                centered
                isOpen={this.state.modal} 
                toggle={() => this.toggle()}
            >
                <ModalHeader 
                    toggle={() => this.toggle()}
                >
                    { this.state.item.id ? 'Edit' : 'Add' } List Item
                </ModalHeader>
                <ModalBody>
                    <div className="row align-content-center mb-4">
                        <div className="align-content-center image-container justify-content-center row">
                            <div className="image rounded">
                                {this.renderImage()}
                            </div>
                        </div>
                        <div className="row align-content-center ml-1">
                            <Input
                                type="file"
                                name="image"
                                accept="image/*"
                                onChange={(e) => this.handleChange(e)}
                            />
                        </div>
                    </div>
                    <InputGroup>
                        <InputGroupText>
                            Name
                        </InputGroupText>
                        <Input 
                            placeholder='Name' 
                            name="name" 
                            value={this.state.item.name || ''} 
                            onChange={(e) => this.handleChange(e)} 
                        />
                    </InputGroup>
                    <div className='mt-4'>
                        <Label for="description">
                            Description
                        </Label>
                        <Input
                            id="description"
                            name="description"
                            value={this.state.item.description} 
                            type="textarea"
                            onChange={(e) => this.handleChange(e)} 
                        />
                    </div>
                </ModalBody>
                <ModalFooter>
                    {this.renderEraseButton()}
                    <Button 
                        color='primary' 
                        disabled={ !this.state.item.name || !this.state.item.description || this.props.isLoading } 
                        onClick={() => this.saveList()}
                    >
                        Save
                    </Button>
                </ModalFooter>
            </Modal>
        );
    }

    private renderImage(){
        if(this.state.item.image) {
            let src = this.state.item.image.name ? URL.createObjectURL(this.state.item.image) : `data:image/jpeg;base64,${this.state.item.image}`
            return (
                <img src={src}></img>
            )
        }
    }

    private renderEraseButton(){
        if(this.props.item.id) 
            return (
                <div className="delete-button">
                    <Button color="danger" onClick={() => this.eraseList()}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#FFFFFF"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                    </Button>
                </div>
            )
    }

    private eraseList(){
        if(confirm(`Are your sure you want to delete Item '${this.state.item.name}'?`)){
            this.props.deleteListItem(this.state.item);
            this.toggle();
        }
    }

    private handleChange(event: any){        
        this.setState({
            ...this.state,
            item: {
                ...this.state.item, 
                [event.target.name]: event.target.name == 'image' ? event.target.files[0] : event.target.value
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
        this.props.item.id ? this.props.updateListItem(this.state.item) : this.props.insertListItem(this.state.item);
        this.toggle();
    }
}

export default connect(
    (state: ApplicationState) => state.listItems, // Selects which state properties are merged into the component's props
    ListItemStore.actionCreators // Selects which action creators are merged into the component's props
) (ListItemModal as any); // eslint-disable-line @typescript-eslint/no-explicit-any
