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
    
    let top = this.makeElement({parent: tableDiv, tag: "div", className: "top"});
    this.search = this.makeElement({
      parent: top, 
      tag: "input", 
      className: "search", 
      event: "keyup", 
      func: () => this.filterData()
    });
    this.search.placeholder = "Начните ввод для поиска... ";
    
    let newBtn = this.makeElement({
      parent: top,
      tag: "button",
      text: "Добавить",
      className: "new-btn",
      event: "click",
      func: () => this.newRecord()
    });
    this.addForm = this.makeElement({parent: tableDiv, tag: "form"});
    this.addForm.name = "add-form";
    this.table = this.makeElement({parent: this.addForm, tag: "table"});
    
    this.makeHead();
    this.makeBody(this.data);
  }

  
  makeElement({parent = null, tag, text = "", className = "", event = "", func = null}) {
    let elm = document.createElement(tag);
    elm.className = "dtb-" + tag;
    if (text) elm.innerHTML = text;
    if (className) elm.className = "dtb-" + className;
    if (event && func) elm.addEventListener(event, func);
    if (parent) parent.appendChild(elm);
    return elm;
  }
  
  
  makeHead() {

    const thead = this.makeElement({parent: this.table, tag: "thead"});
    const tr = this.makeElement({parent: thead, tag: "tr"});
      
    for (let i = 0; i < this.columns.length; i++) {
      let th = this.makeElement({parent: tr, tag: "th", text: this.columns[i].title});
      this.makeSortable(th, i);
    }
    
    this.makeElement({parent: tr, tag: "th", text: "Действия"});
  }
  
   
  makeSortable(th, columnNum) {
    let arrow = this.makeElement({parent: th, tag: "div", className: "arrow"});
    th.onclick = () => this.sortColumn(columnNum, arrow);
  }
  
  
  makeAddRow(tbody) {
    
    //this.addForm = this.makeElement({parent: tbody, tag: "form"});
    this.addRow = this.makeElement({parent: tbody, tag: "tr", className: "hidden"});
    
    for (let column of this.columns) {
      //this.makeElement({parent: this.addRow, tag: "td"});
      let elm = this.makeElement({
        parent: this.makeElement({parent: this.addRow, tag: "td"}), 
        //parent: this.addForm,  
        tag: "input",
        className: "new-value",
      });
      elm.name = column.value;
      elm.required = true;
    }
    
    
    this.makeElement({
      parent: this.makeElement({parent: this.addRow, tag: "td"}),
      //parent: this.addForm,
      tag: "input", 
      //text: "Принять", 
      className: "hidden",
    }).type="submit";
    
    this.addForm.onsubmit = () => this.addRecord(event);
  }
  
  addRecord(event) {
    event.preventDefault();
    //console.log(document.forms["add-form"]["surname"].value);
    const form = document.forms["add-form"];
    let rec = {};
    console.log(this.columns);
    for (let c of this.columns) {
      rec[c.value] = form[c.value].value;
      if (typeof(this.data[0][c.value]) == "number"){
        rec[c.value] = +rec[c.value];
      }
    }
    this.data.push(rec);
    console.log(this.data);
    this.reloadBody();
  }
  
  makeBody(data) {
    
    const tbody = this.makeElement({parent:this.table, tag:"tbody"});
    this.makeAddRow(tbody);
    
    for (let item of data) {
      this.makeRow(this.makeElement({parent:tbody, tag:"tr"}), item);
    }
  }
  
  
  makeRow(tr, item) {
    
    for (let column of this.columns) {
      this.makeElement({parent: tr, tag: "td", text: item[column.value]});
    }
    
    this.makeElement({parent: this.makeElement({parent: tr, tag: "td"}),
                     tag: "button", 
                     text: "Удалить", 
                     className: "del-btn",
                     event: "click",
                     func: () => this.delItem(item["id"])
                    });
  }
  
  
  newRecord() {
    this.addRow.classList.toggle("dtb-hidden");
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
    let findStr = this.search.value.toLowerCase();

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

