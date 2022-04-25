import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store';
import * as ListItemStore from '../../store/ListItem';
import { Button, Input, InputGroup, InputGroupText, Label, ListGroup, ListGroupItem, Modal, ModalBody, ModalFooter, ModalHeader, Media } from 'reactstrap';

class ListItemModal extends React.PureComponent<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            modal: false,
            item: {
                name: '',
                description: '',
                imageFile: null,
                imageSrc: '',
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
        if (this.props.modal && this.props.modal !== this.state.modal) this.setState({
            ...this.state,
            modal: this.props.modal,
        })

        if (this.props.item.listId && this.props.item.listId !== this.state.item.listId) {

            this.setState({
                ...this.state,
                item: {
                    ...this.state.item,
                    listId: this.props.item.listId
                }
            })
        }

        if (this.props.item && this.props.item.id !== this.state.item.id) {

            this.setState({
                ...this.state,
                item: this.props.item
            })
        }
    }


    public render() {
        return (
            <Modal
                isOpen={this.state.modal}
                toggle={() => this.toggle()}
            >
                <ModalHeader
                    toggle={() => this.toggle()}
                >
                    {this.state.item.id ? 'Edit' : 'Add'} List Item
                </ModalHeader>
                <ModalBody>
                    <Media object data-src={this.state.item.imageSrc} />
                    <InputGroup>
                        <InputGroupText>
                            Image
                        </InputGroupText>
                        <Input
                            type="file"
                            onChange={(e) => this.showPreview(e)}
                        />
                    </InputGroup>
                    <InputGroup>
                        <InputGroupText>
                            Name
                        </InputGroupText>
                        <Input
                            placeholder='Name'
                            name="name"
                            value={this.state.item.name}
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
                        disabled={!this.state.item.name || !this.state.item.description || !this.state.item.imageFile || !this.state.item.imageSrc || this.props.isLoading}
                        onClick={() => this.saveList()}
                    >
                        Save
                    </Button>
                </ModalFooter>
            </Modal>
        );
    }

    private renderEraseButton() {
        if (this.props.item.id)
            return (
                <div>
                    <Button
                        color="danger"
                        onClick={() => this.eraseList()}
                    >
                        Erase
                    </Button>
                </div>
            )
    }

    private eraseList() {
        if (confirm(`Are your sure you want to delete Item '${this.state.item.name}'?`)) {
            this.props.deleteListItem(this.state.item);
            this.toggle();
        }
    }

    private handleChange(event: any) {
        this.setState({
            ...this.state,
            item: {
                ...this.state.item,
                [event.target.name]: event.target.value
            }
        })
    }

    private showPreview(event: any) {
        if (!event.target.files || !event.target.files[0]) return;

        let imageFile = event.target.files[0];
        const reader = new FileReader();
        reader.onload = x => {
            this.setState({
                ...this.state,
                item: {
                    ...this.state.item,
                    imageFile: imageFile,
                    imageSrc: x.target ? x.target.result : null
                }
            });
        };

        reader.readAsDataURL(imageFile);
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
