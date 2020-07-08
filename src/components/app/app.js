
import React, {Component} from "react";
import "./app.css";
import nextId from "react-id-generator";
import AppHeader from "../header/header";
import SearchPanel from "../searchPanel/searchPanel";
import PostStatusFilter from "../postStatusFilter/postStatusFilter";
import PostList from "../postList/postList";
import PostAddForm from "../postAddForm/postAddForm";

export default class App extends Component {

    state = {
        data: [
            {label: 'Going to learn', important: false, like: false, id: 1},
            {label: 'That is', important: false,  like: false, id: 2},
            {label: 'I need', important: false, like: false, id: 3}
        ],
        term: '',
        filter: 'all'
    };

    deleteItem = (id) => {
        this.setState(({data}) => {
            const index = data.findIndex(elem => elem.id === id);

            const newArr = [...data.slice(0, index), ...data.slice(index + 1)];
            return {
                data: newArr
            }
        });
    }

    onAdd = (body) => {
        const newItem = {
            label: body,
            important: false,
            id: nextId()
        }

        this.setState(({data}) => {
            console.log([...data, newItem]);
            return {
                data: [...data, newItem]
            }
        });
    }

    onToggleImportant = (id) => {
        this.onToggle(id, false);
    }
    onToggleLike = (id) => {
        this.onToggle(id, true);
    }

    onToggle = (id, isLike) => {
        this.setState(({data}) => {
            const index = data.findIndex(elem => elem.id === id);

            const old = data[index];
            let newItem = {...old, important: !old.important};

            if (isLike) {
                newItem = {...old, like: !old.like};
            }

            const newArr = [...data.slice(0, index), newItem, ...data.slice(index + 1)];

            return {
                data: newArr
            }
        })
    }

    searchPost = (items, term) => {
        if (term.length === 0) {
            return items;
        }

        items.filter((item) => {
            return item.label.indexOf(term) > -1
        });
    }

    filterPost = (items, filter) => {
        if (filter === 'like') {
            return items.filter(item => item.like)
        } else {
            return items;
        }
    }

    onUpdateSearch = (term) => {
        this.setState({term});
    }

    onFilterSelect = (filter) => {
        this.setState({filter})
    }

    render() {
        const {data, term, filter} = this.state;
        const liked = data.filter(item => item.like).length;
        const allPosts = data.length;

        const visiblePosts = this.filterPost(this.searchPost(data, term), filter);

        return (
            <div className="app">
                <AppHeader
                    liked={liked}
                    allPosts={allPosts}/>
                <div className="search-panel d-flex">
                    <SearchPanel
                        onUpdateSearch={this.onUpdateSearch}/>
                    <PostStatusFilter
                        filter={filter}
                        onFilterSelect={this.onFilterSelect}/>
                </div>
                <PostList
                    posts={visiblePosts}
                    onDelete={this.deleteItem}
                    onToggleImportant={this.onToggleImportant}
                    onToggleLike={this.onToggleLike}/>
                <PostAddForm
                    onAdd={this.onAdd}/>
            </div>
        )
    }
}