/**
 * Resize function without multiple trigger
 * 
 * Usage:
 * $(window).smartresize(function(){  
 *     // code here
 * });
 */
(function($,sr){
    // debouncing function from John Hann
    // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
    var debounce = function (func, threshold, execAsap) {
      var timeout;

        return function debounced () {
            var obj = this, args = arguments;
            function delayed () {
                if (!execAsap)
                    func.apply(obj, args); 
                timeout = null; 
            }

            if (timeout)
                clearTimeout(timeout);
            else if (execAsap)
                func.apply(obj, args);

            timeout = setTimeout(delayed, threshold || 100); 
        };
    };

    // smartresize 
    jQuery.fn[sr] = function(fn){  return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr); };

})(jQuery,'smartresize');
/**
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var CURRENT_URL = window.location.href.split('#')[0].split('?')[0],
    $BODY = $('body'),
    $MENU_TOGGLE = $('#menu_toggle'),
    $SIDEBAR_MENU = $('#sidebar-menu'),
    $SIDEBAR_FOOTER = $('.sidebar-footer'),
    $LEFT_COL = $('.left_col'),
    $RIGHT_COL = $('.right_col'),
    $NAV_MENU = $('.nav_menu'),
    $FOOTER = $('footer');

	
	
// Sidebar
function init_sidebar() {
// TODO: This is some kind of easy fix, maybe we can improve this
var setContentHeight = function () {
	// reset height
	$RIGHT_COL.css('min-height', $(window).height());

	var bodyHeight = $BODY.outerHeight(),
		footerHeight = $BODY.hasClass('footer_fixed') ? -10 : $FOOTER.height(),
		leftColHeight = $LEFT_COL.eq(1).height() + $SIDEBAR_FOOTER.height(),
		contentHeight = bodyHeight < leftColHeight ? leftColHeight : bodyHeight;

	// normalize content
	contentHeight -= $NAV_MENU.height() + footerHeight;

	$RIGHT_COL.css('min-height', contentHeight);
};

  $SIDEBAR_MENU.find('a').on('click', function(ev) {
	  console.log('clicked - sidebar_menu');
        var $li = $(this).parent();

        if ($li.is('.active')) {
            $li.removeClass('active active-sm');
            $('ul:first', $li).slideUp(function() {
                setContentHeight();
            });
        } else {
            // prevent closing menu if we are on child menu
            if (!$li.parent().is('.child_menu')) {
                $SIDEBAR_MENU.find('li').removeClass('active active-sm');
                $SIDEBAR_MENU.find('li ul').slideUp();
            }else
            {
				if ( $BODY.is( ".nav-sm" ) )
				{
					$li.parent().find( "li" ).removeClass( "active active-sm" );
					$li.parent().find( "li ul" ).slideUp();
				}
			}
            $li.addClass('active');

            $('ul:first', $li).slideDown(function() {
                setContentHeight();
            });
        }
    });

// toggle small or large menu 
$MENU_TOGGLE.on('click', function() {
		console.log('clicked - menu toggle');
		
		if ($BODY.hasClass('nav-md')) {
			$SIDEBAR_MENU.find('li.active ul').hide();
			$SIDEBAR_MENU.find('li.active').addClass('active-sm').removeClass('active');
		} else {
			$SIDEBAR_MENU.find('li.active-sm ul').show();
			$SIDEBAR_MENU.find('li.active-sm').addClass('active').removeClass('active-sm');
		}

	$BODY.toggleClass('nav-md nav-sm');

	setContentHeight();

	$('.dataTable').each ( function () { $(this).dataTable().fnDraw(); });
});

	// check active menu
	$SIDEBAR_MENU.find('a[href="' + CURRENT_URL + '"]').parent('li').addClass('current-page');

	$SIDEBAR_MENU.find('a').filter(function () {
		return this.href == CURRENT_URL;
	}).parent('li').addClass('current-page').parents('ul').slideDown(function() {
		setContentHeight();
	}).parent().addClass('active');

	// recompute content when resizing
	$(window).smartresize(function(){  
		setContentHeight();
	});

	setContentHeight();

	// fixed sidebar
	if ($.fn.mCustomScrollbar) {
		$('.menu_fixed').mCustomScrollbar({
			autoHideScrollbar: true,
			theme: 'minimal',
			mouseWheel:{ preventDefault: true }
		});
	}
};
// /Sidebar

	var randNum = function() {
	  return (Math.floor(Math.random() * (1 + 40 - 20))) + 20;
	};


// Panel toolbox
$(document).ready(function() {
    $('.collapse-link').on('click', function() {
        var $BOX_PANEL = $(this).closest('.x_panel'),
            $ICON = $(this).find('i'),
            $BOX_CONTENT = $BOX_PANEL.find('.x_content');
        
        // fix for some div with hardcoded fix class
        if ($BOX_PANEL.attr('style')) {
            $BOX_CONTENT.slideToggle(200, function(){
                $BOX_PANEL.removeAttr('style');
            });
        } else {
            $BOX_CONTENT.slideToggle(200); 
            $BOX_PANEL.css('height', 'auto');  
        }

        $ICON.toggleClass('fa-chevron-up fa-chevron-down');
    });

    $('.close-link').click(function () {
        var $BOX_PANEL = $(this).closest('.x_panel');

        $BOX_PANEL.remove();
    });
});
// /Panel toolbox

// Tooltip
$(document).ready(function() {
    $('[data-toggle="tooltip"]').tooltip({
        container: 'body'
    });
});
// /Tooltip

// Progressbar
if ($(".progress .progress-bar")[0]) {
    $('.progress .progress-bar').progressbar();
}
// /Progressbar

// Switchery
$(document).ready(function() {
    if ($(".js-switch")[0]) {
        var elems = Array.prototype.slice.call(document.querySelectorAll('.js-switch'));
        elems.forEach(function (html) {
            var switchery = new Switchery(html, {
                color: '#26B99A'
            });
        });
    }
});
// /Switchery


// iCheck
$(document).ready(function() {
    if ($("input.flat")[0]) {
        $(document).ready(function () {
            $('input.flat').iCheck({
                checkboxClass: 'icheckbox_flat-green',
                radioClass: 'iradio_flat-green'
            });
        });
    }
});
// /iCheck

// Table
$('table input').on('ifChecked', function () {
    checkState = '';
    $(this).parent().parent().parent().addClass('selected');
    countChecked();
});
$('table input').on('ifUnchecked', function () {
    checkState = '';
    $(this).parent().parent().parent().removeClass('selected');
    countChecked();
});

var checkState = '';

$('.bulk_action input').on('ifChecked', function () {
    checkState = '';
    $(this).parent().parent().parent().addClass('selected');
    countChecked();
});
$('.bulk_action input').on('ifUnchecked', function () {
    checkState = '';
    $(this).parent().parent().parent().removeClass('selected');
    countChecked();
});
$('.bulk_action input#check-all').on('ifChecked', function () {
    checkState = 'all';
    countChecked();
});
$('.bulk_action input#check-all').on('ifUnchecked', function () {
    checkState = 'none';
    countChecked();
});

function countChecked() {
    if (checkState === 'all') {
        $(".bulk_action input[name='table_records']").iCheck('check');
    }
    if (checkState === 'none') {
        $(".bulk_action input[name='table_records']").iCheck('uncheck');
    }

    var checkCount = $(".bulk_action input[name='table_records']:checked").length;

    if (checkCount) {
        $('.column-title').hide();
        $('.bulk-actions').show();
        $('.action-cnt').html(checkCount + ' Records Selected');
    } else {
        $('.column-title').show();
        $('.bulk-actions').hide();
    }
}



// Accordion
$(document).ready(function() {
    $(".expand").on("click", function () {
        $(this).next().slideToggle(200);
        $expand = $(this).find(">:first-child");

        if ($expand.text() == "+") {
            $expand.text("-");
        } else {
            $expand.text("+");
        }
    });
});

// NProgress
if (typeof NProgress != 'undefined') {
    $(document).ready(function () {
        NProgress.start();
    });

    $(window).load(function () {
        NProgress.done();
    });
}

	
	  //hover and retain popover when on popover content
        var originalLeave = $.fn.popover.Constructor.prototype.leave;
        $.fn.popover.Constructor.prototype.leave = function(obj) {
          var self = obj instanceof this.constructor ?
            obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type);
          var container, timeout;

          originalLeave.call(this, obj);

          if (obj.currentTarget) {
            container = $(obj.currentTarget).siblings('.popover');
            timeout = self.timeout;
            container.one('mouseenter', function() {
              //We entered the actual popover – call off the dogs
              clearTimeout(timeout);
              //Let's monitor popover content instead
              container.one('mouseleave', function() {
                $.fn.popover.Constructor.prototype.leave.call(self, self);
              });
            });
          }
        };

        $('body').popover({
          selector: '[data-popover]',
          trigger: 'click hover',
          delay: {
            show: 50,
            hide: 400
          }
        });


	function gd(year, month, day) {
		return new Date(year, month - 1, day).getTime();
	}
	  
		
	/* STARRR */
			
	function init_starrr() {
		
		if( typeof (starrr) === 'undefined'){ return; }
		console.log('init_starrr');
		
		$(".stars").starrr();

		$('.stars-existing').starrr({
		  rating: 4
		});

		$('.stars').on('starrr:change', function (e, value) {
		  $('.stars-count').html(value);
		});

		$('.stars-existing').on('starrr:change', function (e, value) {
		  $('.stars-count-existing').html(value);
		});
		
	  };
	 
	 
	   /* AUTOCOMPLETE */
			
		function init_autocomplete() {
			
			if( typeof ($.fn.autocomplete) === 'undefined'){ return; }
			console.log('init_autocomplete');
			
			var countries = { AD:"Andorra",A2:"Andorra Test",AE:"United Arab Emirates",AF:"Afghanistan",AG:"Antigua and Barbuda",AI:"Anguilla",AL:"Albania",AM:"Armenia",AN:"Netherlands Antilles",AO:"Angola",AQ:"Antarctica",AR:"Argentina",AS:"American Samoa",AT:"Austria",AU:"Australia",AW:"Aruba",AX:"Åland Islands",AZ:"Azerbaijan",BA:"Bosnia and Herzegovina",BB:"Barbados",BD:"Bangladesh",BE:"Belgium",BF:"Burkina Faso",BG:"Bulgaria",BH:"Bahrain",BI:"Burundi",BJ:"Benin",BL:"Saint Barthélemy",BM:"Bermuda",BN:"Brunei",BO:"Bolivia",BQ:"British Antarctic Territory",BR:"Brazil",BS:"Bahamas",BT:"Bhutan",BV:"Bouvet Island",BW:"Botswana",BY:"Belarus",BZ:"Belize",CA:"Canada",CC:"Cocos [Keeling] Islands",CD:"Congo - Kinshasa",CF:"Central African Republic",CG:"Congo - Brazzaville",CH:"Switzerland",CI:"Côte d’Ivoire",CK:"Cook Islands",CL:"Chile",CM:"Cameroon",CN:"China",CO:"Colombia",CR:"Costa Rica",CS:"Serbia and Montenegro",CT:"Canton and Enderbury Islands",CU:"Cuba",CV:"Cape Verde",CX:"Christmas Island",CY:"Cyprus",CZ:"Czech Republic",DD:"East Germany",DE:"Germany",DJ:"Djibouti",DK:"Denmark",DM:"Dominica",DO:"Dominican Republic",DZ:"Algeria",EC:"Ecuador",EE:"Estonia",EG:"Egypt",EH:"Western Sahara",ER:"Eritrea",ES:"Spain",ET:"Ethiopia",FI:"Finland",FJ:"Fiji",FK:"Falkland Islands",FM:"Micronesia",FO:"Faroe Islands",FQ:"French Southern and Antarctic Territories",FR:"France",FX:"Metropolitan France",GA:"Gabon",GB:"United Kingdom",GD:"Grenada",GE:"Georgia",GF:"French Guiana",GG:"Guernsey",GH:"Ghana",GI:"Gibraltar",GL:"Greenland",GM:"Gambia",GN:"Guinea",GP:"Guadeloupe",GQ:"Equatorial Guinea",GR:"Greece",GS:"South Georgia and the South Sandwich Islands",GT:"Guatemala",GU:"Guam",GW:"Guinea-Bissau",GY:"Guyana",HK:"Hong Kong SAR China",HM:"Heard Island and McDonald Islands",HN:"Honduras",HR:"Croatia",HT:"Haiti",HU:"Hungary",ID:"Indonesia",IE:"Ireland",IL:"Israel",IM:"Isle of Man",IN:"India",IO:"British Indian Ocean Territory",IQ:"Iraq",IR:"Iran",IS:"Iceland",IT:"Italy",JE:"Jersey",JM:"Jamaica",JO:"Jordan",JP:"Japan",JT:"Johnston Island",KE:"Kenya",KG:"Kyrgyzstan",KH:"Cambodia",KI:"Kiribati",KM:"Comoros",KN:"Saint Kitts and Nevis",KP:"North Korea",KR:"South Korea",KW:"Kuwait",KY:"Cayman Islands",KZ:"Kazakhstan",LA:"Laos",LB:"Lebanon",LC:"Saint Lucia",LI:"Liechtenstein",LK:"Sri Lanka",LR:"Liberia",LS:"Lesotho",LT:"Lithuania",LU:"Luxembourg",LV:"Latvia",LY:"Libya",MA:"Morocco",MC:"Monaco",MD:"Moldova",ME:"Montenegro",MF:"Saint Martin",MG:"Madagascar",MH:"Marshall Islands",MI:"Midway Islands",MK:"Macedonia",ML:"Mali",MM:"Myanmar [Burma]",MN:"Mongolia",MO:"Macau SAR China",MP:"Northern Mariana Islands",MQ:"Martinique",MR:"Mauritania",MS:"Montserrat",MT:"Malta",MU:"Mauritius",MV:"Maldives",MW:"Malawi",MX:"Mexico",MY:"Malaysia",MZ:"Mozambique",NA:"Namibia",NC:"New Caledonia",NE:"Niger",NF:"Norfolk Island",NG:"Nigeria",NI:"Nicaragua",NL:"Netherlands",NO:"Norway",NP:"Nepal",NQ:"Dronning Maud Land",NR:"Nauru",NT:"Neutral Zone",NU:"Niue",NZ:"New Zealand",OM:"Oman",PA:"Panama",PC:"Pacific Islands Trust Territory",PE:"Peru",PF:"French Polynesia",PG:"Papua New Guinea",PH:"Philippines",PK:"Pakistan",PL:"Poland",PM:"Saint Pierre and Miquelon",PN:"Pitcairn Islands",PR:"Puerto Rico",PS:"Palestinian Territories",PT:"Portugal",PU:"U.S. Miscellaneous Pacific Islands",PW:"Palau",PY:"Paraguay",PZ:"Panama Canal Zone",QA:"Qatar",RE:"Réunion",RO:"Romania",RS:"Serbia",RU:"Russia",RW:"Rwanda",SA:"Saudi Arabia",SB:"Solomon Islands",SC:"Seychelles",SD:"Sudan",SE:"Sweden",SG:"Singapore",SH:"Saint Helena",SI:"Slovenia",SJ:"Svalbard and Jan Mayen",SK:"Slovakia",SL:"Sierra Leone",SM:"San Marino",SN:"Senegal",SO:"Somalia",SR:"Suriname",ST:"São Tomé and Príncipe",SU:"Union of Soviet Socialist Republics",SV:"El Salvador",SY:"Syria",SZ:"Swaziland",TC:"Turks and Caicos Islands",TD:"Chad",TF:"French Southern Territories",TG:"Togo",TH:"Thailand",TJ:"Tajikistan",TK:"Tokelau",TL:"Timor-Leste",TM:"Turkmenistan",TN:"Tunisia",TO:"Tonga",TR:"Turkey",TT:"Trinidad and Tobago",TV:"Tuvalu",TW:"Taiwan",TZ:"Tanzania",UA:"Ukraine",UG:"Uganda",UM:"U.S. Minor Outlying Islands",US:"United States",UY:"Uruguay",UZ:"Uzbekistan",VA:"Vatican City",VC:"Saint Vincent and the Grenadines",VD:"North Vietnam",VE:"Venezuela",VG:"British Virgin Islands",VI:"U.S. Virgin Islands",VN:"Vietnam",VU:"Vanuatu",WF:"Wallis and Futuna",WK:"Wake Island",WS:"Samoa",YD:"People's Democratic Republic of Yemen",YE:"Yemen",YT:"Mayotte",ZA:"South Africa",ZM:"Zambia",ZW:"Zimbabwe",ZZ:"Unknown or Invalid Region" };

			var countriesArray = $.map(countries, function(value, key) {
			  return {
				value: value,
				data: key
			  };
			});

			// initialize autocomplete with custom appendTo
			$('#autocomplete-custom-append').autocomplete({
			  lookup: countriesArray
			});
			
		};
	   
	 /* AUTOSIZE */
			
		function init_autosize() {
			
			if(typeof $.fn.autosize !== 'undefined'){
			
			autosize($('.resizable_textarea'));
			
			}
			
		};  
	   
	   
		  /* INPUTS */
		  
			function onAddTag(tag) {
				alert("Added a tag: " + tag);
			  }

			  function onRemoveTag(tag) {
				alert("Removed a tag: " + tag);
			  }

			  function onChangeTag(input, tag) {
				alert("Changed a tag: " + tag);
			  }

			  //tags input
			function init_TagsInput() {
				  
				if(typeof $.fn.tagsInput !== 'undefined'){	
				 
				$('#tags_1').tagsInput({
				  width: 'auto'
				});
				
				}
				
		    };
	   
		/* SELECT2 */
	  
		function init_select2() {
			 
			if( typeof (select2) === 'undefined'){ return; }
			console.log('init_toolbox');
			 
			$(".select2_single").select2({
			  placeholder: "Select a state",
			  allowClear: true
			});
			$(".select2_group").select2({});
			$(".select2_multiple").select2({
			  maximumSelectionLength: 4,
			  placeholder: "With Max Selection limit 4",
			  allowClear: true
			});
			
		};
	    
	   
	   /* DATERANGEPICKER */
	   var selectedDay = moment().format('MM/DD/YYYY');
	   var selectedWeek = {
		   startDate : moment().subtract(6, 'days').format('MM/DD/YYYY'),
		   endDate : moment().format('MM/DD/YYYY')
	   }
	   var selectedMonth = moment().format('MM/YYYY');
	   function init_daterangepicker_right() {
	      
				if( typeof ($.fn.daterangepicker) === 'undefined'){ return; }
				console.log('init_daterangepicker_right');
				console.log(moment());
		  
				var cb = function(start, end, label) {
				  console.log(start.toISOString(), end.toISOString(), label);
				  $('#reportrange_right span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
				};

				var optionSet1 = {
				  startDate: moment().subtract(6, 'days'),
				  endDate: moment(),
				  minDate: '01/01/2012',
				  maxDate: moment().format('MM/DD/YYYY'),
				  dateLimit: {
					days: 60
				  },
				  showDropdowns: true,
				  showWeekNumbers: true,
				  timePicker: false,
				  timePickerIncrement: 1,
				  timePicker12Hour: true,
				  ranges: {
					'Last 7 Days': [moment().subtract(6, 'days'), moment()],
					'Last 30 Days': [moment().subtract(29, 'days'), moment()]
				  },
				  opens: 'right',
				  buttonClasses: ['btn btn-default'],
				  applyClass: 'btn-small btn-primary',
				  cancelClass: 'btn-small',
				  format: 'MM/DD/YYYY',
				  separator: ' to ',
				  locale: {
					applyLabel: 'Submit',
					cancelLabel: 'Cancle',
					fromLabel: 'From',
					toLabel: 'To',
					customRangeLabel: 'Custom',
					daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
					monthNames: ['01월', '02월', '03월', '04월', '05월', '06월', '07월', '08월', '09월', '10월', '11월', '12월'],
					firstDay: 1
				  }
				};

				$('#reportrange_right span').html(moment().subtract(6, 'days').format('MMMM D, YYYY') + ' - ' + moment().format('MMMM D, YYYY'));
				
				$('#reportrange_right').daterangepicker(optionSet1, cb);

				$('#reportrange_right').on('show.daterangepicker', function() {
				  console.log("show event fired");
				});
				$('#reportrange_right').on('hide.daterangepicker', function() {
				  console.log("hide event fired");
				});
				$('#reportrange_right').on('apply.daterangepicker', function(ev, picker) {
				  console.log("apply event fired, start/end dates are " + picker.startDate.format('MMMM D, YYYY') + " to " + picker.endDate.format('MMMM D, YYYY'));
				  selectedWeek.startDate = picker.startDate.format('MM/DD/YYYY');
				  selectedWeek.endDate = picker.endDate.format('MM/DD/YYYY');
				});
				$('#reportrange_right').on('cancel.daterangepicker', function(ev, picker) {
				  console.log("cancel event fired");
				});

				$('#options1').click(function() {
				  $('#reportrange_right').data('daterangepicker').setOptions(optionSet1, cb);
				});

				$('#options2').click(function() {
				  $('#reportrange_right').data('daterangepicker').setOptions(optionSet2, cb);
				});

				$('#destroy').click(function() {
				  $('#reportrange_right').data('daterangepicker').remove();
				});

	   }
	   
	   function init_daterangepicker_left() {
	      
				if( typeof ($.fn.daterangepicker) === 'undefined'){ return; }
				console.log('init_daterangepicker_left');
				console.log(moment());
		  
				var cb = function(start, end, label) {
				  console.log(start.toISOString(), end.toISOString(), label);
				  $('#reportrange_left span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
				};

				var optionSet1 = {
				  startDate: moment().subtract(6, 'days'),
				  endDate: moment(),
				  minDate: '01/01/2012',
				  maxDate: moment().format('MM/DD/YYYY'),
				  dateLimit: {
					days: 60
				  },
				  showDropdowns: true,
				  showWeekNumbers: true,
				  timePicker: false,
				  timePickerIncrement: 1,
				  timePicker12Hour: true,
				  ranges: {
					'Last 7 Days': [moment().subtract(6, 'days'), moment()],
					'Last 30 Days': [moment().subtract(29, 'days'), moment()]
				  },
				  opens: 'left',
				  buttonClasses: ['btn btn-default'],
				  applyClass: 'btn-small btn-primary',
				  cancelClass: 'btn-small',
				  format: 'MM/DD/YYYY',
				  separator: ' to ',
				  locale: {
					applyLabel: 'Submit',
					cancelLabel: 'Cancle',
					fromLabel: 'From',
					toLabel: 'To',
					customRangeLabel: 'Custom',
					daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
					monthNames: ['01월', '02월', '03월', '04월', '05월', '06월', '07월', '08월', '09월', '10월', '11월', '12월'],
					firstDay: 1
				  }
				};

				$('#reportrange_left span').html(moment().subtract(6, 'days').format('MMMM D, YYYY') + ' - ' + moment().format('MMMM D, YYYY'));
				
				$('#reportrange_left').daterangepicker(optionSet1, cb);

				$('#reportrange_left').on('show.daterangepicker', function() {
				  console.log("show event fired");
				});
				$('#reportrange_left').on('hide.daterangepicker', function() {
				  console.log("hide event fired");
				});
				$('#reportrange_left').on('apply.daterangepicker', function(ev, picker) {
				  console.log("apply event fired, start/end dates are " + picker.startDate.format('MMMM D, YYYY') + " to " + picker.endDate.format('MMMM D, YYYY'));
				  selectedWeek.startDate = picker.startDate.format('MM/DD/YYYY');
				  selectedWeek.endDate = picker.endDate.format('MM/DD/YYYY');
				});
				$('#reportrange_left').on('cancel.daterangepicker', function(ev, picker) {
				  console.log("cancel event fired");
				});

				$('#options1').click(function() {
				  $('#reportrange_left').data('daterangepicker').setOptions(optionSet1, cb);
				});

				$('#options2').click(function() {
				  $('#reportrange_left').data('daterangepicker').setOptions(optionSet2, cb);
				});

				$('#destroy').click(function() {
				  $('#reportrange_left').data('daterangepicker').remove();
				});

	   }
	   
	   /* datetimepicker */
	   function init_datetimepicker() {
		   var vMoment = moment();
		   $('#dateDaypicker').datetimepicker({
			   format: 'MM/DD/YYYY',
			   maxDate: vMoment,
			   defaultDate : vMoment
			});
			$('#dateMonthpicker').datetimepicker({
				format: 'MM/YYYY',
				maxDate: vMoment,
				defaultDate : vMoment
			});
			$("#dateDaypicker").on("dp.change", function(e) {
				selectedDay = e.date.format('MM/DD/YYYY');
			});
			$("#dateMonthpicker").on("dp.change", function(e) {
				selectedMonth = e.date.format('MM/YYYY');
			});
	   }
	   
	  	/* PNotify */
			
		function init_PNotify() {
			
			if( typeof (PNotify) === 'undefined'){ return; }
			console.log('init_PNotify');
		}; 
	   
	   		
   	   
		/* DATA TABLES */
			
			function init_DataTables() {
				
				console.log('run_datatables');
				
				if( typeof ($.fn.DataTable) === 'undefined'){ return; }
				var tableName = "";
				if($('#datatableSummary').length == 1) {
					tableName = "datatableSummary";
				}else if($('#datatableError').length == 1) {
					tableName = "datatableError";
				}else if($('#datatableDetail').length == 1) {
					tableName = "datatableDetail";
				}
				if(tableName.length == 0) {return ;}
				console.log('init_DataTables');
				$('#'+tableName).dataTable({
					"searching" : false,
					"scrollY":        450,
					"scrollCollapse": true,
					"lengthMenu": [ 15, 25, 50, 100]
				});
				console.log("exec" + "dataTable");
				var dtable= $('#'+tableName).DataTable();
				var thArr = $('#'+tableName+' thead th');
				$('#'+tableName+' tbody').on('click', 'tr', function() {
					var row = dtable.row(this).data();
					var content = {};
					var i = 0;
					row.forEach(value => {
						content[thArr[i].textContent] = value;
						i++;
					});
					content['length'] = i;
					//modal content create
					var $Form = $('#ContentDetail form');
					$Form.empty();
					for(var value in content) {
						var $div = $('<div/>', {
							'class':'form-goroup'
						});
						var $label1 = $('<label/>', {
							'for':'recipient-name',
							'class':'control-label',
							'text':value
						});
						var $p = $('<p/>', {
							'text':content[value]
						});
						$div.append($label1);
						$div.append($p);
						$Form.append($div);
					}
					$('#ContentDetail').modal();
				});
			};
	function init_charts() {
			
				console.log('run_charts  typeof [' + typeof (Chart) + ']');
			
				if( typeof (Chart) === 'undefined'){ return; }
				
				console.log('init_charts');
			
				
				Chart.defaults.global.legend = {
					enabled: false
				};
				
			  // Line chart
			 
			if ($('#lineChart').length ){	
			
			  var ctx = document.getElementById("lineChart");
			  var lineChart = new Chart(ctx, {
				type: 'line',
				data: {
				  labels: ["January", "February", "March", "April", "May", "June", "July"],
				  datasets: [{
					label: "My First dataset",
					backgroundColor: "rgba(38, 185, 154, 0.31)",
					borderColor: "rgba(38, 185, 154, 0.7)",
					pointBorderColor: "rgba(38, 185, 154, 0.7)",
					pointBackgroundColor: "rgba(38, 185, 154, 0.7)",
					pointHoverBackgroundColor: "#fff",
					pointHoverBorderColor: "rgba(220,220,220,1)",
					pointBorderWidth: 1,
					data: [31, 74, 6, 39, 20, 85, 7]
				  }, {
					label: "My Second dataset",
					backgroundColor: "rgba(3, 88, 106, 0.3)",
					borderColor: "rgba(3, 88, 106, 0.70)",
					pointBorderColor: "rgba(3, 88, 106, 0.70)",
					pointBackgroundColor: "rgba(3, 88, 106, 0.70)",
					pointHoverBackgroundColor: "#fff",
					pointHoverBorderColor: "rgba(151,187,205,1)",
					pointBorderWidth: 1,
					data: [82, 23, 66, 9, 99, 4, 2]
				  }]
				},
				options: {
					maintainAspectRatio: false,
					responsive: true,
					scales: {
						yAxes: [{
							ticks: {
								beginAtZero: true
							}
						}]
					},
				}
			  });
			
			}
		}
	   		
	$('#dateTypeRadio .btn').on('click', function(event) {
	  var val = $(this).find('input').val();
	  if(val == "DAY") {
		  $('#date_day').show();
		  $('#reportrange_week').hide();
		  $('#date_month').hide();
	  } else if(val == "WEEK") {
		  $('#date_day').hide();
		  $('#reportrange_week').show();
		  $('#date_month').hide();
	  } else if(val == "MONTH") {
		  $('#date_day').hide();
		  $('#reportrange_week').hide();
		  $('#date_month').show();
	  } else {
		  return;
	  }
	  console.log(val);
	});
	
	//++Graph 타입에 맞게 바꿔주기
	$('#viewTypeRadio .btn').on('click', function(event) {
	  var val = $(this).find('input').val();
	  if(val == "ELAPSEDT") {
		  $('#Info_Graph_Type').empty();
		  $('#Info_Graph_Type').append("동작 소요시간");
	  } else if(val == "ENDT") {
		  $('#Info_Graph_Type').empty();
		  $('#Info_Graph_Type').append("최종 완료시각");
	  } else {
		  return;
	  }
	});
	   
	$(document).ready(function() {
		$('#dateTypeRadio .btn')[0].click();
		init_sidebar();
		init_daterangepicker_right();
		init_daterangepicker_left();
		init_datetimepicker();
		init_DataTables();
		init_PNotify();
		init_starrr();
		init_autosize();
		init_autocomplete();
		init_charts();		
	});	
	

