import * as React from 'react';
import { Container } from 'reactstrap';
import NavMenu from './NavMenu';
import List from './List'; 

export default class ListLayout extends React.PureComponent<{}, { selectedList: number }> {

    constructor(props: any) {
        super(props);
        this.state = {
            selectedList: 0
        }
    }

    public render() {
        const ListProps = {
            selectList: this.selectList.bind(this)
        }

        return (
            <div className="row">
                <div className="col-4">
                    <List {...ListProps} />
                </div>
                <div className="col-8">
                    {this.state.selectedList}
                </div>
            </div>
        );
    }

    private selectList(id: number){
        this.setState({
            selectedList: id
        })
    }
}