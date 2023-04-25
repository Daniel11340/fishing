

$(document).ready(function () {
    //多筆自由了
    var MaxInputs = 4;                  //maximum input boxes allowed
    var InputsWrapper = $("#healtNum"); //Input boxes wrapper ID
    var AddButton = $("#addNum");       //Add button ID
    var x = InputsWrapper.length;       //initlal text box count
    var FieldCount = 1;                 //to keep track of text box added
    // 如有使用者以填寫的資料，將重新生成
  
  
  
    $(AddButton).click(function (e)    //on add input button click
    {
      if (x <= MaxInputs)             //max input box allowed
      {
        if (!confirm('確認要新增健保卡號?')) {
          return false;
        }
        FieldCount++;               //text box added increment
        //add input box
        $('.note').last().before('<div class="item"><label for="RegisterBE_HealthId">發放對象健保卡號#' + FieldCount + '</label><div><div><input type="text" maxlength="12" id="RegisterBE_HealthId" name="RegisterBE.HealthId" aria-label="發放對象健保卡號#' + FieldCount + '" placeholder="12位數字(必填)" value=""><button id="removeNum" class="r delete" aria-label="刪除卡號#' + FieldCount + '">刪除</button></div></div></div>');
        $('input[name="RegisterBE.HealthId"]').last().val("");
        $('input[name="RegisterBE.HealthId"]').last().focus();
        x++; //text box increment
      }
      return  false;
    });
    $("body").on("click", "#removeNum",  function (e) { //user click on remove text
      if (x > 1)
      {
        if (!confirm('確認要刪除健保卡號?')) {
          return false;
        }
        $(this).parents().eq(2).remove(); //獲取當前元素的父元素的父元素的DIV並刪除
        x--; //decrement textbox
        FieldCount = x;
  
        //redo bind List
        var div = document.getElementById("childList");
        $(div).find('.item').each(function (index) {
          $(this).find('input:text').attr('placeholder', '12位數字(必填)');
          if (index == 0) {
            $(this).find('label').html('發放對象健保卡號 <span class="visually-hidden">代領上限為4位(含本人5位)</span>');
            $(this).find('input:text').attr('aria-label', '發放對象健保卡號#1，代領上限為4位(含本人5位)');
          }
          else {
            $(this).find('label').text('發放對象健保卡號#' + (index + 1));
            $(this).find('input:text').attr('aria-label', '發放對象健保卡號#' + (index + 1));
          }
          $(this).find('button').attr('aria-label', '刪除卡號#' + (index + 1));
        });
      }
      return  false;
    })
    //多筆結束了
    var obj = BankListData();
    var keys = [];
    for (var prop in obj) {
      keys.push(prop);
    }
    keys.sort();
    for (let i = 0; i < keys.length; i++) {
      var key = keys[i];
      var value = obj[key];
      $("#RegisterBE_SelectedBank").append(new Option(key + value,key,false));
    }
    var selected = '';
    if (selected != '') {
      $("#RegisterBE_SelectedBank").val(selected).change();
    }
  });
  
  function submitFunction() {
  
    var bankName = $("#RegisterBE_SelectedBank option:selected").text();
    $("#SelectedBankName").val(bankName);
    if (isConfirm()) {
      // RegisterBE_HealthId
  
      let healthIds = $('input[name="RegisterBE.HealthId"]');
      let healthIdStr = ""
      for (let i = 0; i < healthIds.length; i++) {
        let healthIdIndex = i + 1;
        if (i > 0) {
          healthIdStr += ","
        }
        healthIdStr += $(healthIds[i]).val();
      }
      $("#RegisterBE_HiddenHealth").val(healthIdStr);
      document.getElementById("Register").submit();
    }
  }
  function backFunction() {
    var destUrl = '/';
    window.location.href = "https://6000.gov.tw/";
  }
  function isConfirm() {
    var m_msg = "";
  
    try {
      if (document.getElementById("RegisterBE_ParentId").value == "") {
        m_msg += "*身分證字號或居留證統一證號 未填寫。\r\n";
        document.getElementById("RegisterBE_ParentId").focus();
      }
      if ($("#RegisterBE_SelectedBank option:selected").val() == "") {
        if (m_msg == "") {
          document.getElementById("RegisterBE_SelectedBank").focus();
        }
        m_msg += "*金融機構代號 未勾選。\r\n";
      }
      if (document.getElementById("RegisterBE_BankAccount").value == "") {
        if (m_msg == "") {
          document.getElementById("RegisterBE_BankAccount").focus();
        }
        m_msg += "*金融機構帳號 未填寫。\r\n";
      }
      let healthIds = $('input[name="RegisterBE.HealthId"]');
      for (let i = 0; i < healthIds.length; i++) {
        let healthIdIndex = i + 1;
        if ($(healthIds[i]).val() == "") {
          if (m_msg == "") {
            $(healthIds[i]).focus();
          }
          m_msg += "*健保卡號#" + healthIdIndex + " 未填寫。\r\n";
        }
        //else if ($(healthIds[i]).val().length != 12) {
        //    m_msg += "*健保卡號#" + healthIdIndex + " "  + $(healthIds[i]).val() + " 輸入錯誤。\r\n";
        //}
      }
  
      if (m_msg != "") {
        alert(m_msg);
        return false;
      }
      return true;
    }
    catch (e) {
      alert(e);
      return false;
    }
  }
  