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
    this.table = this.makeElement("table");
    tableDiv.appendChild(this.table);
    
    this.makeHead();
    this.makeBody();
  }
  
  makeHead() {
    const thead = this.makeElement("thead");
    this.table.appendChild(thead);
    
    const tr = this.makeElement("tr");
    thead.appendChild(tr);
      
    for (let i = 0; i < this.columns.length; i++) {
      let th = this.makeElement("th", this.columns[i].title);
      tr.appendChild(th);
      this.makeSortable(th, i);
    }
    
    tr.appendChild(this.makeElement("th", "Действия"));
  }
  
  
  makeElement(name, value = "", className = "", func = null) {
    let elm = document.createElement(name);
    elm.className = "dtb-" + name;
    if (value) elm.innerHTML = value;
    if (className) elm.className = className;
    if (func) elm.onclick = func; 
    return elm;
  }
  
    
  makeSortable(th, columnNum) {
    let arrow = this.makeElement("div", "", "dtb-arrow");
    th.appendChild(arrow);
    th.onclick = () => this.sortColumn(columnNum, arrow);
  }
  
  
  makeBody() {
    
    const tbody = this.makeElement("tbody");
    this.table.appendChild(tbody);
  
    for (let item of this.data) {
      let tr = this.makeElement("tr");
      tbody.appendChild(tr);
      this.makeRow(tr, item);
    }
  }
  
  
  makeRow(tr, item) {
    
    for (let column of this.columns) {
      let td = this.makeElement("td", item[column.value]);
      tr.appendChild(td);
    }
    
    let td = this.makeElement("td");
    tr.appendChild(td);
    let delBtn = this.makeElement("button", "Удалить", "dtb-del-btn", () => this.delItem(item["id"]));
    td.appendChild(delBtn);
  }
  
  
  delItem(id) {
    console.log(id);
    for (let i = 0; i < this.data.length; i++) {
      if (this.data[i].id == id) {
        this.data.splice(i, 1);
        break;
      }
    }
    this.reloadBody();
  }
  
  
  reloadBody() {
    this.table.removeChild(this.table.lastChild);
    this.makeBody();
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

