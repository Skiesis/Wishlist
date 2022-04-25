import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store';
import * as ListStore from '../../store/List';
import { ListGroup, ListGroupItem } from 'reactstrap';
import ListModal from './ListModal';

class List extends React.PureComponent<any, any> {

    constructor(props: any){
        super(props);
        this.state = {
            selectedList: {},
            modal: false,
            editList: {},
        }
    }
    // This method is called when the component is first added to the document
    public componentDidMount() {
        this.ensureDataFetched();
    }

    public render() {
        const ModalProps = {
            list: this.state.editList,
            modal: this.state.modal,
            setModal: this.setModal.bind(this),
            selectList: this.selectList.bind(this)
        }

        return (
            <React.Fragment>
                <div className='row'>
                    <div className='col-6 align-items-center flex-row justify-content-center row mb-4'>
                        <button className='btn btn-outline-info btn-sm rounded-pill' onClick={() => this.addList()}>+ Add New List</button>
                    </div>
                </div>
                <div>
                    <ListGroup>
                        {this.props.lists.map((list: ListStore.List) => 
                            <ListGroupItem tag="button" active={ list.id === this.state.selectedList.id } onClick={(e) => this.clickList(e, list)} key={ list.id }>{ list.name }</ListGroupItem>
                        )}
                    </ListGroup>
                    <ListModal {...ModalProps} />
                </div>
                { this.renderLoading() }
            </React.Fragment>
        );
    }

    private addList() {
        this.setState({
            ...this.state, 
            editList: {
                name: ''
            }
        }, () => {
            this.setModal();
        })
    }

    private setModal() {
        this.setState({
            ...this.state, 
            modal: !this.state.modal
        })
    }

    private ensureDataFetched() {
        this.props.requestLists();
    }

    private clickList(event: any, list: ListStore.List){
        switch(event.detail){
            case 1: 
                this.selectList(list);
                break;
            case 2: 
                this.setState({
                    ...this.state,
                    editList: list
                }, () => {
                    this.setModal();
                })
                break;
            default: 
                return;
        }
    }

    private selectList(list: ListStore.List) {
        this.setState({
            ...this.state,
            selectedList: list
        });
        this.props.selectList(list);
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
    (state: ApplicationState) => state.lists, // Selects which state properties are merged into the component's props
    ListStore.actionCreators // Selects which action creators are merged into the component's props
) (List as any); // eslint-disable-line @typescript-eslint/no-explicit-any
