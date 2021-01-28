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

  let dt = new DataTable(config1, users);

};


class DataTable {
  
  constructor(config, data) {
  
    this.parent = config.parent;
    this.columns = config.columns;
    this.data = data;
      
    const tableDiv = document.querySelectorAll(config.parent)[0];
    this.table = document.createElement("table");
    this.table.className = "table";
    tableDiv.appendChild(this.table);
  
    this.makeHead();
    this.makeBody();
  }
  
  makeHead() {
    const thead = document.createElement("thead");
    this.table.appendChild(thead);
    
    const tr = document.createElement("tr");
    tr.className = "tr tr-head"; 
    thead.appendChild(tr);
      
    for (let i = 0; i < this.columns.length; i++) {
    
      let th = document.createElement("th");
      th.innerHTML = this.columns[i].title;
      th.className = "th";
      tr.appendChild(th);
      
      let arrow = document.createElement("div");
      arrow.className = "arrow";
      th.appendChild(arrow);
      
      th.onclick = () => this.sortColumn(i, arrow);
    }
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
