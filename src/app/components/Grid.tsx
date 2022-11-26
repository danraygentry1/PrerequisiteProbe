import * as React from 'react';
import * as ReactDOM from 'react-dom';
import JqxListBox, { IListBoxProps } from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxlistbox';
import JqxGrid, { IGridProps, jqx } from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxgrid';
import JqxButton from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxbuttons';
import JqxTooltip from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxtooltip';
import JqxPanel from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxpanel';
import { generatedata } from '../../sampledata/generatedata';
import {Simulate} from "react-dom/test-utils";
import mouseOver = Simulate.mouseOver;
interface IState extends IGridProps {
    listBoxSource: IListBoxProps['source'];
}
interface IMyProps {
    columns: any,
    rows: any,
    innerRows: any
}
class Grid extends React.PureComponent<{}, IState, IMyProps> {
    private myGrid = React.createRef<JqxGrid>();
    private counter: number = 1;
    private myPanel = React.createRef<JqxPanel>();
    constructor(props: IMyProps) {
        super(props);
        this.clearFiltering = this.clearFiltering.bind(this);
        this.myGridOnFilter = this.myGridOnFilter.bind(this);
        this.myListBoxOnCheckChange = this.myListBoxOnCheckChange.bind(this);
       /* this.excelBtnOnClick = this.excelBtnOnClick.bind(this)*/
        //this.state.ready = this.state.ready.bind(this);
        const source: any =
            {
                datafields: [
                    { name: 'pt_school_id', type: 'number', map: '0' },
                    { name: 'school_name', type: 'string', map: '1' },
                    { name: 'state', type: 'string', map: '2' },
                    { name: 'program_link', type: 'string', map: '3' },
                    { name: 'program_start_dt', type: 'date', map: '4' },
                    { name: 'ptcas_deadline_dt', type: 'date', map: '5' },
                    { name: 'ptcas_participate', type: 'bool', map: '6' },
                    { name: 'interview_req', type: 'bool', map: '7' },
                    { name: 'lor_num', type: 'number', map: '8' },
                    { name: 'rolling_admission', type: 'bool', map: '9' },
                    { name: 'class_size', type: 'number', map: '10' },
                    { name: 'degree_req', type: 'string', map: '11' },
                    { name: 'required', type: 'bool', map: '12' },
                    { name: 'hours_min', type: 'number', map: '13' },
                    { name: 'hours_competitive', type: 'number', map: '14' },
                    { name: 'tuition_in_state_full', type: 'number', map: '15' },
                    { name: 'tuition_out_state_full', type: 'number', map: '16' },
                    { name: 'gpa_overall_min', type: 'float', map: '17' },
                    { name: 'gpa_overall_avg', type: 'float', map: '18' },
                    { name: 'gpa_prereq_min', type: 'float', map: '19' },
                    { name: 'gpa_prereq_avg', type: 'float', map: '20' },
                    { name: 'gpa_science_min', type: 'float', map: '21' },
                    { name: 'gpa_science_avg', type: 'float', map: '22' },
                    { name: 'gpa_prereq_last60_min', type: 'float', map: '23' },
                    { name: 'gpa_prereq_last60_avg', type: 'float', map: '24' },
                    { name: 'gre_required', type: 'bool', map: '25' },
                    { name: 'score_verbal_min', type: 'number', map: '26' },
                    { name: 'score_verbal_avg', type: 'number', map: '27' },
                    { name: 'score_quant_min', type: 'number', map: '28' },
                    { name: 'score_quant_avg', type: 'number', map: '29' },
                    { name: 'score_writing_min', type: 'number', map: '30' },
                    { name: 'score_writing_avg', type: 'number', map: '31' },
                    { name: 'score_total_min', type: 'number', map: '32' },

                ],
                datatype: 'array',
                localdata: props.rows
            };
        const linkrenderer = (row: number, column: any, value: any): any => {
            if (value.indexOf('#') !== -1) {
                value = value.substring(0, value.indexOf('#'));
            }
            const format = { target: '"_blank"' };
            const html = jqx.dataFormat.formatlink(value, format);
            return html;
        }
        const ptSchoolCourseSource: any = {
            datafields: [
                { name: 'pt_school_id', type: 'number', map: '0' },
                { name: 'course_name', type: 'string', map: '1' },
                { name: 'lab_req', type: 'string', map: '2' },
            ],
            datatype: 'array',
            localdata: props.innerRows
        };
        const coursesDataAdapter = new jqx.dataAdapter(ptSchoolCourseSource, { autoBind: true });
        const renderer = (row: number, column: any, value: string): string => {
            return '<span style="margin-left: 4px; margin-top: 9px; float: left;">' + value + '</span>';
        }
        const nestedGrids: any[] = [];
        const initrowdetails = (index: number, parentElement: any, gridElement: any, record: any): void => {
            const id = record.pt_school_id.toString();
            const nestedGridContainer = parentElement.children[0];
            nestedGrids[index] = nestedGridContainer;
            const filtergroup = new jqx.filter();
            const filtervalue = id;
            const filtercondition = 'equal';
            const filter = filtergroup.createfilter('stringfilter', filtervalue, filtercondition);
            // fill the orders depending on the id.
            const courses = coursesDataAdapter.records;
            const coursesbyid = [];
            for (const course of courses) {
                const result = filter.evaluate(course.pt_school_id);
                if (result) {
                    coursesbyid.push(course);
                }
            }
            const coursesSource = {
                datafields: [
                    { name: 'pt_school_id', type: 'number' },
                    { name: 'course_name', type: 'string' },
                    { name: 'lab_req', type: 'string' }
                ],
                id: 'pt_school_id',
                localdata: coursesbyid
            }
            const nestedGridAdapter = new jqx.dataAdapter(coursesSource);
            if (nestedGridContainer != null) {
                const columngroups =  [
                    { text: 'Class Prerequisites', align: 'center', name: 'ProgramPrerequisites' }
                ]
                const columns: IGridProps['columns'] = [
                    { text: 'Course Name', datafield: 'course_name', columngroup: 'ProgramPrerequisites', width: 200 },
                    { text: 'Lab Required', datafield: 'lab_req', columngroup: 'ProgramPrerequisites',  width: 150 }
                ];
                ReactDOM.render(
                    <JqxGrid width={600} height={200} theme={'bootstrap'} source={nestedGridAdapter} columns={columns} columngroups={columngroups} />,
                    document.getElementById(nestedGridContainer.id)
                );
            }
        };
        const tooltiprenderer = (element: any): void => {
            const id = `toolTipContainer${this.counter}`;
            element[0].id = id;
            let content = element[0].innerText;
            let tooltip: any
            switch (content){
                case 'Name':
                    tooltip = 'School Name';
                    break;
                case 'State':
                    tooltip = 'School State';
                    break;
                case 'Program Link':
                    tooltip = 'Program Link';
                    break;
                case 'PTCAS Participate?':
                    tooltip = 'Participating in PTCAS??';
                    break;
                case 'Interview?':
                    tooltip = 'Interview Required?';
                    break;
                case 'LOR':
                    tooltip = 'Letters of Recommendation';
                    break;
                case 'Roll Admiss?':
                    tooltip = 'Rolling Admission';
                    break;
                case 'Program Start Dt':
                    tooltip = 'PT Program Start Date';
                    break;
                case 'App Deadline':
                    tooltip = 'Application Deadline Date';
                    break;
                case 'Class Size':
                    tooltip = 'Class Size';
                    break;
                case 'Dgr Req?':
                    tooltip = 'Degree Required';
                    break;
                case 'Hrs Req?':
                    tooltip = 'Observation Hours Required?';
                    break;
                case 'Hrs Min':
                    tooltip = 'Minimum Observation Hours';
                    break;
                case 'Hrs Rec':
                    tooltip = 'Recommended Observation Hours';
                    break;
                case 'In State':
                    tooltip = 'In State Tuition';
                    break;
                case 'Out of State':
                    tooltip = 'Out Of State Tuition';
                    break;
                case 'Cum Min':
                    tooltip = 'Minimum Cumulative GPA';
                    break;
                case 'Cum Avg':
                    tooltip = 'Average Cumulative GPA';
                    break;
                case 'Prereq Min':
                    tooltip = 'Minimum Prerequisite GPA';
                    break;
                case 'Prereq Avg':
                    tooltip = 'Average Prerequisite GPA';
                    break;
                case 'Sci Min':
                    tooltip = 'Minimum Science GPA';
                    break;
                case 'Sci Avg':
                    tooltip = 'Average Science GPA';
                    break;
                case 'Last 60 Min':
                    tooltip = 'Minimum Last 60 credits GPA';
                    break;
                case 'Last 60 Avg':
                    tooltip = 'Average Last 60 credits GPA';
                    break;
                case 'GRE Req?':
                    tooltip = 'GRE Required';
                    break;
                case 'Verb Min':
                    tooltip = 'Minimum Verbal GRE Score';
                    break;
                case 'Verb Avg':
                    tooltip = 'Average Verbal GRE Score';
                    break;
                case 'Quant Min':
                    tooltip = 'Minimum Quantitative GRE Score';
                    break;
                case 'Quant Avg':
                    tooltip = 'Average Quantitative GRE Score';
                    break;
                case 'Write Min':
                    tooltip = 'Minimum Writing GRE Score';
                    break;
                case 'Write Avg':
                    tooltip = 'Average Writing GRE Score';
                    break;
                case 'Tot Min':
                    tooltip = 'Minimum Total GRE Score';
                    break;
                default:
                    tooltip = '';
            }

            setTimeout(() => {
                ReactDOM.render(<JqxTooltip position={'mouse'} theme={'bootstrap'} content={tooltip}>{content}</JqxTooltip>, document.getElementById(id));
            });
            this.counter++;
        };
        this.state = {
             columngroups: [
                { text: 'School', align: 'center', name: 'school' },
                 { text: 'Observation', align: 'center', name: 'observation' },
                 { text: 'Tuition', align: 'center', name: 'tuition' },
                { text: 'GRE', align: 'center', name: 'gre' },
                { text: 'GPA', align: 'center', name: 'gpa' }
            ],
            columns: [
                { text: 'Name',  datafield: 'school_name',  columntype: 'textbox', filtertype: 'input', width: '15%',  enabletooltips:true, pinned: true, rendered: tooltiprenderer }, //pinned: true
                { text: 'Pt School Id', datafield: 'pt_school_id', filtertype: 'number', cellsalign: 'right', columngroup: 'school', width: '6%',  enabletooltips:true, hidden:true },
                { text: 'State',  datafield: 'state', filtertype: 'checkedlist', width: '7%', columngroup: 'school', enabletooltips:true, rendered: tooltiprenderer }, //pinned: true
                { text: 'Program Start Dt', datafield: 'program_start_dt', filtertype: 'range', cellsalign: 'right', cellsformat: 'd', columngroup: 'school', width: '9%', enabletooltips:true, hidden:true, rendered: tooltiprenderer   },
                { text: 'Program Link',  datafield: 'program_link', columntype: 'textbox', filtertype: 'input', width: '8%', columngroup: 'school', enabletooltips:true, cellsrenderer: linkrenderer, rendered: tooltiprenderer }, //pinned: true
                { text: 'App Deadline', datafield: 'ptcas_deadline_dt', filtertype: 'range', cellsalign: 'right', cellsformat: 'd', columngroup: 'school', width: '8%', enabletooltips:true, hidden:true, rendered: tooltiprenderer },
                { text: 'PTCAS Participate?', datafield: 'ptcas_participate', columntype: 'checkbox', filtertype: 'bool', threestatecheckbox: true, columngroup: 'school', hidden:true, width: '9%', enabletooltips:true, rendered: tooltiprenderer },
                { text: 'Interview?', datafield: 'interview_req', columntype: 'checkbox', filtertype: 'bool', threestatecheckbox: true, columngroup: 'school',  width: '6%', enabletooltips:true, rendered: tooltiprenderer },
                { text: 'LOR', datafield: 'lor_num', filtertype: 'number', columngroup: 'school', width: '5%', enabletooltips:true, rendered: tooltiprenderer },
                { text: 'Roll Admiss?', datafield: 'rolling_admission', columntype: 'checkbox', filtertype: 'bool', threestatecheckbox: true, columngroup: 'school',  width: '6%', enabletooltips:true, hidden:true, rendered: tooltiprenderer },
                { text: 'Class Size', datafield: 'class_size', filtertype: 'number', cellsalign: 'right', columngroup: 'school', width: '6%', enabletooltips:true, hidden:true, rendered: tooltiprenderer },
                { text: 'Dgr Req?', datafield: 'degree_req', columntype: 'textbox', filtertype: 'input', columngroup: 'school', width: '6%', enabletooltips:true, hidden:true, rendered: tooltiprenderer },
                { text: 'Hrs Req?', datafield: 'required', columntype: 'checkbox', filtertype: 'bool', threestatecheckbox: true, columngroup: 'observation',  width: '6%', enabletooltips:true, rendered: tooltiprenderer },
                { text: 'Hrs Min', datafield: 'hours_min', filtertype: 'number', cellsalign: 'right', columngroup: 'observation', width: '5%', enabletooltips:true, rendered: tooltiprenderer },
                { text: 'Hrs Rec', datafield: 'hours_competitive', filtertype: 'number', cellsalign: 'right', columngroup: 'observation', width: '5%', enabletooltips:true, hidden:true, rendered: tooltiprenderer },
                { text: 'In State', datafield: 'tuition_in_state_full',  filtertype: 'number', cellsalign: 'right', cellsformat: 'c2', columngroup: 'tuition', width: '7%', enabletooltips:true, rendered: tooltiprenderer },
                { text: 'Out of State', datafield: 'tuition_out_state_full',  filtertype: 'number', cellsalign: 'right', cellsformat: 'c2', columngroup: 'tuition', width: '7%', enabletooltips:true, rendered: tooltiprenderer },
                { text: 'Cum Min', datafield: 'gpa_overall_min', filtertype: 'number', cellsalign: 'right', columngroup: 'gpa', width: '5%', enabletooltips:true, rendered: tooltiprenderer  },
                { text: 'Cum Avg', datafield: 'gpa_overall_avg', filtertype: 'number', cellsalign: 'right', columngroup: 'gpa', width: '5%', enabletooltips:true, hidden:true, rendered: tooltiprenderer  },
                { text: 'Prereq Min', datafield: 'gpa_prereq_min', filtertype: 'number', cellsalign: 'right', columngroup: 'gpa', width: '6%', enabletooltips:true,  rendered: tooltiprenderer },
                { text: 'Prereq Avg', datafield: 'gpa_prereq_avg', filtertype: 'number', cellsalign: 'right', columngroup: 'gpa', width: '7%', enabletooltips:true, hidden:true, rendered: tooltiprenderer },
                { text: 'Sci Min', datafield: 'gpa_science_min', filtertype: 'number', cellsalign: 'right', columngroup: 'gpa', width: '5%', enabletooltips:true, hidden:true, rendered: tooltiprenderer  },
                { text: 'Sci Avg', datafield: 'gpa_science_avg', filtertype: 'number', cellsalign: 'right', columngroup: 'gpa', width: '5%', enabletooltips:true, hidden:true, rendered: tooltiprenderer  },
                { text: 'Last 60 Min', datafield: 'gpa_prereq_last60_min', filtertype: 'number', cellsalign: 'right', columngroup: 'gpa', width: '7%', enabletooltips:true, hidden:true, rendered: tooltiprenderer },
                { text: 'Last 60 Avg', datafield: 'gpa_prereq_last60_avg', filtertype: 'number', cellsalign: 'right', columngroup: 'gpa', width: '7%', enabletooltips:true, hidden:true, rendered: tooltiprenderer },
                { text: 'GRE Req?', datafield: 'gre_required', columntype: 'checkbox', filtertype: 'bool', threestatecheckbox: true, columngroup: 'gre',  width: '6%', enabletooltips:true, rendered: tooltiprenderer },
                { text: 'Verb Min', datafield: 'score_verbal_min', filtertype: 'number', cellsalign: 'right', columngroup: 'gre', width: '5%', enabletooltips:true, rendered: tooltiprenderer },
                { text: 'Verb Avg', datafield: 'score_verbal_avg', filtertype: 'number', cellsalign: 'right', columngroup: 'gre', width: '5%', enabletooltips:true, hidden:true, rendered: tooltiprenderer },
                { text: 'Quant Min', datafield: 'score_quant_min', filtertype: 'number', cellsalign: 'right', columngroup: 'gre', width: '6%', enabletooltips:true, rendered: tooltiprenderer },
                { text: 'Quant Avg', datafield: 'score_quant_avg', filtertype: 'number', cellsalign: 'right', columngroup: 'gre', width: '6%', enabletooltips:true, hidden:true, rendered: tooltiprenderer },
                { text: 'Write Min', datafield: 'score_writing_min', filtertype: 'number', cellsalign: 'right', columngroup: 'gre', width: '6%',  enabletooltips:true, rendered: tooltiprenderer },
                { text: 'Write Avg', datafield: 'score_writing_avg', filtertype: 'number', cellsalign: 'right', columngroup: 'gre', width: '6%',  enabletooltips:true, hidden:true, rendered: tooltiprenderer },
                { text: 'Tot Min', datafield: 'score_total_min', filtertype: 'number', cellsalign: 'right', columngroup: 'gre', width: '5%',  enabletooltips:true, hidden:true, rendered: tooltiprenderer }, //, cellsrenderer: renderer
            ],

            listBoxSource: [
                { label: 'Program Link', value: 'program_link', checked: true },
                { label: 'Program Start Date', value: 'program_start_dt', checked: false },
                { label: 'Application Deadline', value: 'ptcas_deadline_dt', checked: false },
                { label: 'PTCAS Participating?', value: 'ptcas_participate', checked: false },
                { label: 'Interview Required?', value: 'interview_req', checked: true },
                { label: 'Letters of Recommendation (LOR)', value: 'lor_num', checked: true },
                { label: 'Rolling Admission?', value: 'rolling_admission', checked: false },
                { label: 'Class Size', value: 'class_size', checked: false },
                { label: 'Degree Required?', value: 'degree_req', checked: false },
                { label: 'Hrs Required', value: 'required', checked: true },
                { label: 'Hrs Min', value: 'hours_min', checked: true },
                { label: 'Hrs Recommended', value: 'hours_competitive', checked: false },
                { label: 'Tuition (In State)', value: 'tuition_in_state_full', checked: true },
                { label: 'Tuition (Out State)', value: 'tuition_out_state_full', checked: true },
                { label: 'GPA Cumulative Min', value: 'gpa_overall_min', checked: true },
                { label: 'GPA Cumulative Avg', value: 'gpa_overall_avg', checked: false },
                { label: 'GPA Prereq Min', value: 'gpa_prereq_min', checked: true },
                { label: 'GPA Prereq Avg', value: 'gpa_prereq_avg', checked: false },
                { label: 'GPA Science Min', value: 'gpa_science_min', checked: false },
                { label: 'GPA Science Avg', value: 'gpa_science_avg', checked: false },
                { label: 'GPA Last 60 Min', value: 'gpa_prereq_last60_min', checked: false },
                { label: 'GPA Last 60 Avg', value: 'gpa_prereq_last60_avg', checked: false },
                { label: 'GRE Required?', value: 'gre_required', checked: true },
                { label: 'GRE Verb Min', value: 'score_verbal_min', checked: true },
                { label: 'GRE Verb Avg', value: 'score_verbal_avg', checked: false },
                { label: 'GRE Quant Min', value: 'score_quant_min', checked: true },
                { label: 'GRE Quant Avg', value: 'score_quant_avg', checked: false },
                { label: 'GRE Write Min', value: 'score_writing_min', checked: true },
                { label: 'GRE Write Avg', value: 'score_writing_avg', checked: false },
                { label: 'GRE Total Min', value: 'score_total_min', checked: false }
            ],
            initrowdetails,
            ready: (): void => {
                this.myGrid.current!.showrowdetails(1);
            },
            rowdetailstemplate: {
                rowdetails: '<div id="nestedGrid" style="margin: 10px;"></div>',
                rowdetailsheight: 220,
                rowdetailshidden: true
            },
            source: new jqx.dataAdapter(source)
        }

    }
    public render() {
        console.log(this.myGrid);
        return (
            <div className="container-fluid">
                <div className="row mt-1">
                    <div className="card p-0 col-md-7 border-0 " >
                        <div className="card-body mt-2 mb-2">
                            <div style={{fontSize: 12}}>*Tutition data reflects our best efforts to calculate based on criteria presented on PT school websites. </div>
                            <div style={{fontSize: 12}}> *GPA, GRE, LOR and Observation minimums and averages display "0" if no minimum or average was found for that school, i.e., Prereq Min = 0. </div>
                            <div style={{fontSize: 12}}> *Interview Required, Rolling Admissions, and GRE Required values are assumed as "No" if no data was found for that school. </div>
                        </div>
                    </div>
                    <div className="card col-md-5 border-0 align-items-start mt-2 mb-2">
                        <div className="card-body">
                            <div style={{fontSize: 12, fontWeight:"bold"}}>***This dashboard is up to date as of November 20, 2022.*** </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="card p-0 col-md-2 border-dark">
                        <div className="card-body">
                            <h5 className="card-title align-center" style={{fontSize: 14, fontWeight:"bold"}}>Add/Remove Search Columns</h5>
                            <JqxListBox theme={'bootstrap'} onCheckChange={this.myListBoxOnCheckChange}
                                        style={{ float: 'left' }}
                                        width='100%' height={600}
                                        source={this.state.listBoxSource} checkboxes={true}/>

                            <hr />
                        </div>
                    </div>

                    <div className="card  col-md-10 border-dark">
                        <div className="row ">
                          <div className="card p-0 col-md-12 border-0">
                                    <div className="card-body p-1">
                                        <JqxGrid ref={this.myGrid} onFilter={this.myGridOnFilter}
                                            // @ts-ignore
                                                 //style={{ float: 'left', marginLeft: '20px' }}
                                                //style={{backgroundColor: '#F5F8FF', bottom: '#F5F8FF'}}
                                                 theme={'bootstrap'} columngroups={this.state.columngroups}
                                                 width='100%' height={500}
                                                 source={this.state.source} columns={this.state.columns}
                                                 rowdetails={true}
                                                 rowsheight={35} initrowdetails={this.state.initrowdetails}
                                            //ready={this.state.ready}
                                                 pageable={true} autoheight={true}
                                                 sortable={true} altrows={true}
                                                 filterable={true} showfilterrow={true}
                                                 selectionmode={'multiplecellsextended'}
                                                 columnsresize={true}
                                                 rowdetailstemplate={this.state.rowdetailstemplate}
                                        />
                                    </div>
                          </div>
                        </div>
                        {/*</div>*/}
                        <div className="row p-1">
                        {/*flex align-items-center justify-content-center*/}
                            <div className="card col-md-2 border-0 flex align-items-center justify-content-center">
                                <div className="card-body card col-md-2 border-0 flex align-items-center" >
                                    <br />
                                     <JqxButton onClick={this.clearFiltering} theme={"bootstrap"} width={100} height={20}>Clear Filter</JqxButton>
                                </div>
                            </div>
                            <div className="card col-md-3 border-0 flex align-items-center ">
                                <div className="card-body card border-0" style={{fontSize: 20, fontWeight:"bold"}}>
                                    Filters: <JqxPanel ref={this.myPanel} theme={"bootstrap"} width={300} height={120} />
                                </div>
                            </div>
                            {/*<div className="card col-md-7 border-0 flex align-items-end ">
                                <br />
                                <div className="card-body card border-0">
                                    <JqxButton onClick={this.excelBtnOnClick}> <img src="../../../images/PT%20School%20Probe/export-excel%20icon.png" alt="" /></JqxButton>
                                </div>
                            </div>*/}

                        </div>
                    </div>
                </div>
            </div>
        );
    }
    private clearFiltering(): void {
        this.myGrid.current!.clearfilters();
    };
    private myGridOnFilter(): void {
        this.myPanel.current!.clearcontent();
        const filterinfo = this.myGrid.current!.getfilterinformation();
        for (const filterinfoItem of filterinfo) {
            const eventData = '&nbsp &nbsp--&nbsp' + filterinfoItem.filtercolumntext;
            this.myPanel.current!.prepend('<div style="margin-top: 5px;">' + eventData + '</div>');
        }
    };
   /* private excelBtnOnClick() {
        this.myGrid.current!.exportdata('xls', 'jqxGrid');
    };*/
    private myListBoxOnCheckChange(event: any): void {
        this.myGrid.current!.beginupdate();
        if (event.args.checked) {
            this.myGrid.current!.showcolumn(event.args.value);
        }
        else {
            this.myGrid.current!.hidecolumn(event.args.value);
        }
        this.myGrid.current!.endupdate();
    };

}
export default Grid;
