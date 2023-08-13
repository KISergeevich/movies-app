import { Tabs } from 'antd'
import { Component } from 'react'
import './header.css'

export default class Header extends Component {
  items = [
    {
      key: '1',
      label: 'Search',
      children: (
        <input
          className="header__search"
          placeholder="Type to search..."
          onChange={(event) => this.searchChanged(event)}
          type="text"
        />
      ),
    },
    {
      key: '2',
      label: 'Rated',
    },
  ]

  searchChanged(event) {
    const { onSearch } = this.props
    onSearch(event.target.value)
  }

  render() {
    return (
      <header>
        <Tabs defaultActiveKey="1" centered items={this.items} />
      </header>
    )
  }
}
