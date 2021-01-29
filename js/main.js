document.body.onload = function() {
  const config1 = {
    parent: '#usersTable',
    columns: [
      {title: 'Имя', value: 'name'},
      {title: 'Фамилия', value: 'surname'},
      {title: 'Возраст', value: 'age'},
    ]
  };

  const users = [
    {id: 30050, name: 'Вася', surname: 'Петров', age: 12},
    {id: 30051, name: 'Алиса', surname: 'Васечкина', age: 15},
    {id: 30052, name: 'Илья', surname: 'Семенов', age: 13},
    {id: 30053, name: 'Юлия', surname: 'Иванова', age: 15},
    {id: 30054, name: 'Степан', surname: 'Сидоров', age: 13},
    {id: 30055, name: 'Миша', surname: 'Лазарев', age: 12},
    {id: 30056, name: 'Даша', surname: 'Васечкина', age: 15},
  ];

  const config2 = {
    parent: '#usersTable',
    columns: [
      {title: 'Имя', value: 'name'},
      {title: 'Фамилия', value: 'surname'},
      {title: 'Дата рождения', value: 'birthday'},
    ],
    apiUrl: "https://mock-api.shpp.me/asadov/users"
  };
  
  DataTable(config1, users);
  //DataTable(config2);

};


function DataTable(config, data) {
  let dt = new DTable(config, data);
  dt.make();
}


class DTable {
  
  constructor(config, data) {
  
    this.parent = config.parent;
    this.columns = config.columns;
    this.data = data;
  }
  
  
  make() {
    
    const tableDiv = document.querySelectorAll(this.parent)[0];
    let top = this.makeElement(tableDiv, "div", "", "dtb-top");
    let search = this.makeElement(top, "input", "", "dtb-search");
    search.onkeyup = () => this.filterData(search);
    
    this.table = this.makeElement(tableDiv, "table");
    
    this.makeHead();
    this.makeBody(this.data);
  }

  
  makeElement(parent, name, value = "", className = "", func = null) {
    let elm = document.createElement(name);
    elm.className = "dtb-" + name;
    if (value) elm.innerHTML = value;
    if (className) elm.className = className;
    if (func) elm.onclick = func;
    parent.appendChild(elm);
    return elm;
  }
  
  
  makeHead() {

    const thead = this.makeElement(this.table, "thead");
    const tr = this.makeElement(thead, "tr");
      
    for (let i = 0; i < this.columns.length; i++) {
      let th = this.makeElement(tr, "th", this.columns[i].title);
      this.makeSortable(th, i);
    }
    
    this.makeElement(tr, "th", "Действия");
  }
  
   
  makeSortable(th, columnNum) {
    let arrow = this.makeElement(th, "div", "", "dtb-arrow");
    th.onclick = () => this.sortColumn(columnNum, arrow);
  }
  
  
  makeBody(data) {
    
    const tbody = this.makeElement(this.table, "tbody");
  
    for (let item of data) {
      this.makeRow(this.makeElement(tbody, "tr"), item);
    }
  }
  
  
  makeRow(tr, item) {
    
    for (let column of this.columns) {
      this.makeElement(tr, "td", item[column.value]);
    }
    
    this.makeElement(this.makeElement(tr, "td"), "button", "Удалить", "dtb-del-btn", () => this.delItem(item["id"]));
  }
  
  
  delItem(id) {
      for (let i = 0; i < this.data.length; i++) {
      if (this.data[i].id == id) {
        this.data.splice(i, 1);
        break;
      }
    }
    this.reloadBody();
  }
  
  
  reloadBody(data = null) {
    this.table.removeChild(this.table.lastChild);
    this.makeBody(data ? data : this.data);
  }
  
  
  sortColumn(columnNum, arrow) {
    const val = this.columns[columnNum].value;
    if (arrow.classList.contains("dtb-arrow-up")) {
      arrow.classList.remove("dtb-arrow-up");
      arrow.classList.add("dtb-arrow-down");
      this.data.sort((a, b) => a[val] > b[val] ? -1 : 1);
    } else {
      arrow.classList.remove("dtb-arrow-down");
      arrow.classList.add("dtb-arrow-up");
      this.data.sort((a, b) => a[val] < b[val] ? -1 : 1);
    }
    this.reloadBody();
  }
  
  filterData(searchInput) {
    let findStr = searchInput.value.toLowerCase();

    if (findStr.length < 1) this.reloadBody();

    let fdata = this.data.filter((item) => {
      for (let c of this.columns) {
        if ((item[c.value] + "").toLowerCase().includes(findStr)) {
          return true;
        }
      }
      return false;
    });

    this.reloadBody(fdata);
  }
  
}


/*
 //this.getData(config.apiUrl);
  getData(url) {
    fetch(url)
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        this.data = this.makeData(data.data);
        this.makeBody();
        console.log(this.data);
    });
  }
  
  makeData(rawData) {
    let res = [];
    for (let d in rawData) {
        res.push(rawData[d]);
    }
    return res;
  }
 */

