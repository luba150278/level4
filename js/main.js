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
    apiUrl: "http://mock-api.shpp.me/asadov/users"
  };
  
  let dt = new DataTable(config2);

};


class DataTable {
  
  constructor(config, data) {
  
    this.parent = config.parent;
    this.columns = config.columns;
      
    const tableDiv = document.querySelectorAll(config.parent)[0];
    this.table = document.createElement("table");
    this.table.className = "table";
    tableDiv.appendChild(this.table);
  
    this.makeHead();

    if(data) {
        this.data = data;
        this.makeBody();
        return;
    }
    this.getData(config.apiUrl);
    
    
  }
  
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
  
  makeHead() {
    const thead = document.createElement("thead");
    this.table.appendChild(thead);
    
    const tr = document.createElement("tr");
    tr.className = "tr tr-head"; 
    thead.appendChild(tr);
      
    for (let i = 0; i < this.columns.length; i++) {
      let th = this.makeTh(this.columns[i].title);
      tr.appendChild(th);
      let arrow = document.createElement("div");
      arrow.className = "arrow";
      th.appendChild(arrow);
      th.onclick = () => this.sortColumn(i, arrow);
    }
    tr.appendChild(this.makeTh("Действия"));
  }
  
  makeTh(caption) {
    let th = document.createElement("th");
    th.innerHTML = caption;
    th.className = "th";
    return th;
  }
  
  
  makeBody() {
    
    const tbody = document.createElement("tbody");
    this.table.appendChild(tbody);
  
    for (let item of this.data) {
      let tr = document.createElement("tr");
      tr.className = "tr";
      tbody.appendChild(tr);
      this.makeDataRow(tr, item);
    }
  }
  
  makeDataRow(tr, item) {
    
    for (let column of this.columns) {
      let td = document.createElement("td");
      td.className = "td";
      td.innerHTML = item[column.value];
      tr.appendChild(td);
    }
    let td = document.createElement("td");
    td.className = "td";
    tr.appendChild(td);
    let delBtn = document.createElement("button");
    delBtn.innerHTML = "Удалить";
    delBtn.className = "del-btn";
    td.appendChild(delBtn);
    delBtn.onclick = () => this.delItem(item["id"]);
  }
  
  delItem(id) {
    console.log(id);
  }
  
  
  reloadBody() {
    this.table.removeChild(this.table.lastChild);
    this.makeBody();
  }
  
  sortColumn(columnNum, arrow) {
    const val = this.columns[columnNum].value;
    if (arrow.classList.contains("arrow-up")) {
      arrow.classList.remove("arrow-up");
      arrow.classList.add("arrow-down");
      this.data.sort((a, b) => a[val] > b[val] ? -1 : 1);
    } else {
      arrow.classList.remove("arrow-down");
      arrow.classList.add("arrow-up");
      this.data.sort((a, b) => a[val] < b[val] ? -1 : 1);
    }
    this.reloadBody();
  }
  
}
