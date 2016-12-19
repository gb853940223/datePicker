import 'babel-polyfill'

class datePickerObject {
  constructor(settings) {
    this.settings = settings;
    this.top = this.settings.selector.offset().top + 35;
    this.left = this.settings.selector.offset().left;
    this.currentDate = this.settings.selector.val()  ? new Date(this.settings.selector.val()) : new Date();
    this.selectedDay = new Date(this.settings.selector.val());
  }
  prevsMonth(){
    this.currentDate.setDate(1);
    this.currentDate.setMonth(this.currentDate.getMonth()-1);
  }
  nextMonth(){
    this.currentDate.setDate(1);
    this.currentDate.setMonth(this.currentDate.getMonth()+1);
  }
  getTemplate(){
    let getWeekOfFirstDay = this.getWeekOfFirstDay();
    let daysArr = Array(getWeekOfFirstDay).fill('');
    for (let i = 1; i <= this.getDaysOfMonth(); i++){
      daysArr.push(i);
    }
    return `
        <div class="dateHeader">
          <span class="prevs"><</span>
          <span class="currentMonth">${this.currentDate.getFullYear()}年${this.getMonthNumber()}月</span>
          <span class="next">></span>
          <span class="clear">清除</span>
        </div>
        <div class="dateBody">
          <div class="weeks">
            ${ this.settings.week.map((w) =>
              `
                <span>${w}</span>
              `
            ).join('')}
          </div>
          <div class="days">
            ${ daysArr.map((d) =>
              `
                <span class='${ d ? 'singleDay' : ''} ${this.isSelected(d) ? 'selected' : ''}'>${d}</span>
              `
            ).join('')}
          </div>
          </div>
        </div>
    `
  }
  getMonthNumber(){
    return this.settings.month[this.currentDate.getMonth()];
  }
  getWeekOfFirstDay(){
    let date = this.currentDate.getFullYear() + ',' + (this.currentDate.getMonth()+1) + ',' + '1';
    let day = new Date(date);
    return day.getDay();
  }
  getDaysOfMonth(){
    let year = this.currentDate.getFullYear();
    let month = this.currentDate.getMonth();
    let leafDays = ['31','29','31','30','31','30','31','31','30','31','30','31'];
    let normalDays = ['31','28','31','30','31','30','31','31','30','31','30','31'];
    if((year % 4 == 0) && (year % 100 != 0 || year % 400 == 0)){//闰年
      return leafDays[month];
    }else {
      return normalDays[month];
    }
  }
  setSelectedDay(date){
    this.selectedDay = new Date(date);
  }
  getSelectedDay(){
    return this.selectedDay.getDate()>9 ? this.selectedDay.getFullYear() + '-' + (this.selectedDay.getMonth()+1) + '-' + this.selectedDay.getDate() : this.selectedDay.getFullYear() + '-' + (this.selectedDay.getMonth()+1) + '-0' + this.selectedDay.getDate();
    // return this.selectedDay.getFullYear() + '-' + (this.selectedDay.getMonth()+1) + '-' + this.selectedDay.getDate();
  }
  isSelected(d){
    return (this.currentDate.getFullYear() + '-' + (this.currentDate.getMonth()+1) + '-' + d) === this.getSelectedDay() ;
  }
  setStyle(){
    $('#datePicker').css({
      position: "absolute",
      top: this.top,
      left: this.left,
      border: '1px solid ' + this.settings.borderColor,
      'z-index' : '100'
    });
    $('#datePicker .dateHeader').css({
      background: this.settings.headerColor,
      color : this.settings.headerFontColor,
      lineHeight:'34px',

    });
    $('#datePicker .dateBody').css({
      background : this.settings.bodyBackgroundColor,
    });
    $('#datePicker .dateBody .singleDay.selected').css({
      background : this.settings.selectedBackgroundColor,
      color : this.settings.selectedColor,
    });

  }
  todayHighLight(){
    let todayDate = new Date().getDate(),
        $singleDay = $('#datePicker .dateBody .singleDay');
    $.each($singleDay,function(i,val){
      if(todayDate == $(this).text()){
        $(this).css({
          background : this.settings.selectedBackgroundColor,
          color : this.settings.selectedColor,
        });
        return false;
      }
    })
  }
  //是否具有清除功能
  clearShow(){
    if(!this.settings.clearShow){
      $('.dateHeader .clear').hide();
    }
  }
  show(){
    if($(document).find('#datePicker').length){
      $(document).find('#datePicker').empty().append(this.getTemplate());
    } else {
      $('body').append('<div id="datePicker"></div>');
      $(document).find('#datePicker').append(this.getTemplate());
    }
    $(document).find('#datePicker').show();
    this.setStyle();
    this.clearShow();
    // this.todayHighLight();

  }
  close(){
    $(document).find('#datePicker').hide();

  }
}

let defaultSetting = {
  borderColor : '#41a9cc',
  headerColor : '#41a9cc',
  bodyBackgroundColor : '#fff',
  headerFontColor :  '#fff',
  headerHoverColor : '#257eae',
  week: ['日','一','二','三','四','五','六'],
  month: ['一','二','三','四','五','六','七','八','九','十','十一','十二'],
  dateHoverColor : '#e5e5e5',
  selectedColor : '#fff',
  selectedBackgroundColor : '#257eae',
  clearShow : true,
  selectedComplet : function(e){
    // 选中日期之后的回调函数
    return false;
  }
}

export default function datePicker(obj){
  var a = 0;
  let settings = Object.assign({},defaultSetting,obj);
  var dateInstance = new datePickerObject(settings);

  dateInstance.show();
  //上一个月
  $(document).off('click','#datePicker .prevs');
  $(document).on('click', '.prevs', (event)=> {
    event.preventDefault();
    event.stopPropagation();
    /* Act on the event */
    dateInstance.prevsMonth();
    dateInstance.show();
  });
  //下一个月
  $(document).off('click','#datePicker .next');
  $(document).on('click', '.next', (event)=> {
    event.preventDefault();
    event.stopPropagation();
    /* Act on the event */
    dateInstance.nextMonth();
    dateInstance.show();
  });
  //选择日期
  $(document).off('click','#datePicker .singleDay');
  $(document).on('click', '#datePicker .singleDay', function(event) {
    event.preventDefault();
    event.stopPropagation();
    /* Act on the event */
    let dateString = dateInstance.currentDate.getFullYear() + ',' + (dateInstance.currentDate.getMonth()+1) + ',' + $(this).html();
    dateInstance.setSelectedDay(dateString);
    dateInstance.settings.selector.val(dateInstance.getSelectedDay());
    dateInstance.settings.selectedComplet();
    dateInstance.close();
  });
  //清除
  $(document).off('click','#datePicker .clear');
  $(document).on('click', '#datePicker .clear', function(event) {
    event.preventDefault();
    event.stopPropagation();
    /* Act on the event */
    dateInstance.settings.selector.val('');
    // console.log('wtf');
    dateInstance.close();
  });
  //点击其他地方关闭
  $(document).click(function(event) {
    event.preventDefault();
    dateInstance.close();
  });
  $(parent.document).on('click',(e)=>{
    e.stopPropagation()
    dateInstance.close();
  });
}
