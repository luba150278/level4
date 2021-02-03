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
    parent: '#remoteTable',
    columns: [
      {title: 'Имя', value: 'name'},
      {title: 'Фамилия', value: 'surname'},
      {title: 'Дата рождения', value: 'birthday'},
      {title: 'Аватар', value: 'avatar'},
    ],
    apiUrl: "https://mock-api.shpp.me/asadov/users"
  };
  
  DataTable(config1, users);
  DataTable(config2);

};


function DataTable(config, data) {
  let dt;
  if (data) {
    dt = new LocalDTable(config, data);
  } else if (config.apiUrl) {
    dt = new RemoteDTable(config);
  } else {
    return;
  }
  dt.make();
}


function makeElement({parent = null, tag, text = "", className = "", event = "", func = null}) {
  let elm = document.createElement(tag);
  elm.className = "dtb-" + tag;
  if (text) elm.innerHTML = text;
  if (className) elm.className = "dtb-" + className;
  if (event && func) elm.addEventListener(event, func);
  if (parent) parent.appendChild(elm);
  return elm;
}


class DTable {
  
  constructor(config) {
    this.parent = config.parent;
    this.columns = config.columns;
    this.data = null;
  }
  
  
  make() {
    const tableDiv = document.querySelectorAll(this.parent)[0];
    
    this.makeTopControls(tableDiv)

    this.addForm = makeElement({parent: tableDiv, tag: "form"});
    this.addForm.name = "add-form";
    this.table = makeElement({parent: this.addForm, tag: "table"});
    
    this.makeHead();
    this.makeBody(this.data);
  }
  

  makeTopControls(tableDiv) {
    let top = makeElement({parent: tableDiv, tag: "div", className: "top"});
    
    this.search = makeElement({
      parent: top, 
      tag: "input", 
      className: "search", 
      event: "keyup", 
      func: () => this.filterData()
    });
    this.search.placeholder = "Начните ввод для поиска... ";
    
    let newBtn = makeElement({
      parent: top,
      tag: "button",
      text: "Добавить",
      className: "new-btn",
      event: "click",
      func: () => this.showNewRecordForm()
    });
  }


  makeHead() {
    const thead = makeElement({parent: this.table, tag: "thead"});
    const tr = makeElement({parent: thead, tag: "tr"});
      
    for (let i = 0; i < this.columns.length; i++) {
      let th = makeElement({parent: tr, tag: "th", text: this.columns[i].title});
      this.makeSortable(th, i);
    }
    
    makeElement({parent: tr, tag: "th", text: "Действия"});
  }
  
   
  makeSortable(th, columnNum) {
    let arrow = makeElement({parent: th, tag: "div", className: "arrow"});
    th.onclick = () => this.sortColumn(columnNum, arrow);
  }
  
  
  makeNewRecordForm(tbody) {
    this.addRow = makeElement({parent: tbody, tag: "tr", className: "hidden"});
    
    for (let column of this.columns) {
      let elm = makeElement({
        parent: makeElement({parent: this.addRow, tag: "td"}), 
        tag: "input",
        className: "new-value",
      });
      elm.name = column.value;
      elm.required = true;
    }
    
    makeElement({
      parent: makeElement({parent: this.addRow, tag: "td"}),
      tag: "input", 
      className: "hidden",
    }).type="submit";
    
    this.addForm.onsubmit = () => this.addRecord(event);
  }
  

  makeBody(data) {
    const tbody = makeElement({parent:this.table, tag:"tbody"});
    this.makeNewRecordForm(tbody);
    
    for (let item of data) {
      this.makeRow(makeElement({parent:tbody, tag:"tr"}), item);
    }
  }
  
  
  makeRow(tr, item) {
    for (let column of this.columns) {
      makeElement({parent: tr, tag: "td", text: item[column.value]});
    }
    
    makeElement({parent: makeElement({parent: tr, tag: "td"}),
                tag: "button", 
                text: "Удалить", 
                className: "del-btn",
                event: "click",
                func: () => this.delRecord(item["id"])
              });
  }
  
  
  showNewRecordForm() {
    this.addRow.classList.toggle("dtb-hidden");
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
  
  createRecord() {
    let rec = {};
    for (let c of this.columns) {
      rec[c.value] = this.addForm[c.value].value;
      if (typeof(this.data[0][c.value]) == "number"){
        rec[c.value] = +rec[c.value];
      }
    }
    return rec;
  }
}


class LocalDTable extends DTable {
  constructor(config, data) {
    super(config);
    this.data = data;
    this.lastId = data[data.length - 1].id;
  }

  delRecord(id) {
    for (let i = 0; i < this.data.length; i++) {
      if (this.data[i].id == id) {
        this.data.splice(i, 1);
        break;
      }
    }
    this.reloadBody();
  }

  addRecord(event) {
    event.preventDefault();
    let rec = this.createRecord();
    rec.id = ++this.lastId;
    this.data.push(rec);
    this.reloadBody();
  }

  
}


class RemoteDTable extends DTable {
  constructor(config) {
    super(config);
    this.apiUrl = config.apiUrl;
  }

  async make() {
    this.data = await this.getData();
    super.make();
    console.log(this.data);
  }

  async getData() {
    const response = await fetch(this.apiUrl);
    if(!response.ok) {
      return;
    }
    const data = await response.json();
    return this.transformData(data.data);
  }
  
  transformData(rawData) {
    let res = [];
    for (let d in rawData) {
      if(!rawData[d].id) rawData[d].id = d;  
      res.push(rawData[d]);
    }
    return res;
  }

  async delRecord(id) {
    const response = await fetch(this.apiUrl + "/" + id, {method: "DELETE"});
    if (response.ok) {
      this.data = await this.getData();   
      this.reloadBody();
    }
  }

  async addRecord(event) {
    event.preventDefault();
    let rec = this.createRecord();
    const response = await fetch(this.apiUrl, {
      method: 'POST',
      body: JSON.stringify(rec),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (response.ok){
      this.data = await this.getData(); 
      this.reloadBody();
    }
  }
  
}


