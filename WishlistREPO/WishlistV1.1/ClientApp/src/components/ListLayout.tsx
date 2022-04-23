import * as React from 'react';
import { Container } from 'reactstrap';
import NavMenu from './NavMenu';
import List from './List/List'; 
import ListItems from './ListItem/ListItems';

export default class ListLayout extends React.PureComponent<{}, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            selectedList: {}
        }
    }

    public render() {
        const ListProps = {
            selectList: this.selectList.bind(this)
        }

        const ListItemProps = {
            list: this.state.selectedList
        }

        return (
            <div className="row">
                <div className="col-4">
                    <List {...ListProps} />
                </div>
                <div className="col-8">
                    <ListItems {...ListItemProps} />
                </div>
            </div>
        );
    }

    private selectList(list: any){
        this.setState({
            selectedList: list
        })
    }
}