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
        //this.state.ready = this.state.ready.bind(this);
        const source: any =
            {
                datafields: [
                    { name: 'school_name', type: 'string', map: '1' },
                    { name: 'state', type: 'string', map: '2' },
                    { name: 'interview_req', type: 'bool', map: '3' },
                    { name: 'lor_num', type: 'number', map: '4' },
                    { name: 'program_start_dt', type: 'date', map: '5' },
                    { name: 'ptcas_deadline_dt', type: 'date', map: '6' },
                    { name: 'class_size', type: 'number', map: '7' },
                    { name: 'hours_min', type: 'number', map: '8' },
                    { name: 'tuition_in_state_full', type: 'number', map: '9' },
                    { name: 'tuition_out_state_full', type: 'number', map: '10' },
                    { name: 'gpa_prereq_min', type: 'float', map: '11' },
                    { name: 'gpa_overall_min', type: 'float', map: '12' },
                    { name: 'score_verbal_min', type: 'number', map: '13' },
                    { name: 'score_quant_min', type: 'number', map: '14' },
                    { name: 'score_total_min', type: 'number', map: '15' }
                ],
                datatype: 'array',
                localdata: props.rows
            };
        const ptSchoolCourseSource: any = {
            datafields: [
                { name: 'pt_school_id', type: 'number', map: '0' },
                { name: 'course_name', type: 'string', map: '1' },
                { name: 'course_level', type: 'string', map: '2' },
                { name: 'lab_req', type: 'string', map: '3' },
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
            record.uid += 1
            const id = record.uid.toString();
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
                    { name: 'course_level', type: 'string' },
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
                    { text: 'Course Level', datafield: 'course_level', columngroup: 'ProgramPrerequisites',  width: 200 },
                    { text: 'Lab Required', datafield: 'lab_req', columntype: 'checkbox', filtertype: 'bool', columngroup: 'ProgramPrerequisites',  width: 150 }
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
                case 'Interview?':
                    tooltip = 'Interview Required?';
                    break;
                case 'LOR':
                    tooltip = 'Letters off Recommendation';
                    break;
                case 'Program Start Dt':
                    tooltip = 'PT Program Start Date';
                    break;
                case 'PTCAS Deadline':
                    tooltip = 'PTCAS Deadline Date';
                    break;
                case 'Class Size':
                    tooltip = 'Class Size';
                    break;
                case 'Obs Hrs':
                    tooltip = 'Minimum Observation Hours';
                    break;
                case 'In State':
                    tooltip = 'In State Tuition';
                    break;
                case 'Out of State':
                    tooltip = 'Out Of State Tuition';
                    break;
                case 'Prq Min':
                    tooltip = 'Minimum Prerequisite GPA';
                    break;
                case 'Cum Min':
                    tooltip = 'Minimum Cumulative GPA';
                    break;
                case 'Verb Min':
                    tooltip = 'Minimum Verbal GRE Score';
                    break;
                case 'Quant Min':
                    tooltip = 'Minimum Quantitative GRE Score';
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
                 { text: 'Tuition', align: 'center', name: 'tuition' },
                { text: 'GRE', align: 'center', name: 'gre' },
                { text: 'GPA', align: 'center', name: 'gpa' }
            ],
            columns: [
                { text: 'Name',  datafield: 'school_name', columntype: 'textbox', filtertype: 'input', width: '15%', columngroup: 'school', enabletooltips:true, rendered: tooltiprenderer }, //pinned: true
                { text: 'State',  datafield: 'state', filtertype: 'checkedlist', width: '7%', columngroup: 'school', enabletooltips:true, rendered: tooltiprenderer }, //pinned: true
                { text: 'Interview?', datafield: 'interview_req', columntype: 'checkbox', filtertype: 'bool', threestatecheckbox: true, columngroup: 'school',  width: '6%', enabletooltips:true, rendered: tooltiprenderer },
                { text: 'LOR', datafield: 'lor_num', filtertype: 'number', columngroup: 'school', width: '5%', enabletooltips:true, rendered: tooltiprenderer },
                { text: 'Program Start Dt', datafield: 'program_start_dt', filtertype: 'range', cellsalign: 'right', cellsformat: 'd', columngroup: 'school', width: '9%', enabletooltips:true, rendered: tooltiprenderer   },
                { text: 'PTCAS Deadline', datafield: 'ptcas_deadline_dt', filtertype: 'range', cellsalign: 'right', cellsformat: 'd', columngroup: 'school', width: '9%', enabletooltips:true, rendered: tooltiprenderer },
                { text: 'Class Size', datafield: 'class_size', filtertype: 'number', cellsalign: 'right', columngroup: 'school', width: '6%', enabletooltips:true, hidden:true, rendered: tooltiprenderer },
                { text: 'Obs Hrs', datafield: 'hours_min', filtertype: 'number', cellsalign: 'right', columngroup: 'school', width: '5%', enabletooltips:true, rendered: tooltiprenderer },
                { text: 'In State', datafield: 'tuition_in_state_full',  filtertype: 'number', cellsalign: 'right', cellsformat: 'c2', columngroup: 'tuition', width: '8%', enabletooltips:true, rendered: tooltiprenderer },
                { text: 'Out of State', datafield: 'tuition_out_state_full',  filtertype: 'number', cellsalign: 'right', cellsformat: 'c2', columngroup: 'tuition', width: '8%', enabletooltips:true, rendered: tooltiprenderer },
                { text: 'PreReq Min', datafield: 'gpa_prereq_min', filtertype: 'number', cellsalign: 'right', columngroup: 'gpa', width: '7%', enabletooltips:true, rendered: tooltiprenderer },
                { text: 'Cum Min', datafield: 'gpa_overall_min', filtertype: 'number', cellsalign: 'right', columngroup: 'gpa', width: '5%', enabletooltips:true, rendered: tooltiprenderer  },
                { text: 'Verb Min', datafield: 'score_verbal_min', filtertype: 'number', cellsalign: 'right', columngroup: 'gre', width: '5%', enabletooltips:true, rendered: tooltiprenderer },
                { text: 'Quant Min', datafield: 'score_quant_min', filtertype: 'number', cellsalign: 'right', columngroup: 'gre', width: '6%', enabletooltips:true, rendered: tooltiprenderer },
                { text: 'Tot Min', datafield: 'score_total_min', filtertype: 'number', cellsalign: 'right', columngroup: 'gre', width: '5%',  enabletooltips:true, rendered: tooltiprenderer } //, cellsrenderer: renderer
            ],
            listBoxSource: [
                { label: 'Interview?', value: 'interview_req', checked: true },
                { label: 'LOR', value: 'lor_num', checked: true },
                { label: 'Program Start Date', value: 'program_start_dt', checked: true },
                { label: 'PTCAS Deadline', value: 'ptcas_deadline_dt', checked: true },
                { label: 'Class Size', value: 'class_size', checked: false },
                { label: 'Obs Hrs Min', value: 'hours_min', checked: true },
                { label: 'Tuition (In State)', value: 'tuition_in_state_full', checked: true },
                { label: 'Tuition (Out State)', value: 'tuition_out_state_full', checked: true },
                { label: 'GPA PreReq Min', value: 'gpa_prereq_min', checked: true },
                { label: 'GPA Cumulative Min', value: 'gpa_overall_min', checked: true },
                { label: 'GRE Verb Min', value: 'score_verbal_min', checked: true },
                { label: 'GRE Quant Min', value: 'score_quant_min', checked: true },
                { label: 'GRE Total Min', value: 'score_total_min', checked: true }
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
                <div className="row">
                    <div className="card p-0 col-md-2 border-dark">
                        <div className="card-body">
                            <h5 className="card-title">Add/Remove Search Columns</h5>
                            <JqxListBox theme={'bootstrap'} onCheckChange={this.myListBoxOnCheckChange}
                                        style={{ float: 'left' }}
                                        width='100%' height={200}
                                        source={this.state.listBoxSource} checkboxes={true}/>
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
                        <div className="row p-3">
                        {/*flex align-items-center justify-content-center*/}
                            <div className="card col-md-2 border-0 flex align-items-center justify-content-center">
                                <div className="card-body card col-md-2 border-0 flex align-items-center" >
                                    <br />
                                     <JqxButton onClick={this.clearFiltering} theme={"bootstrap"} width={100} height={20}>Clear Filter</JqxButton>
                                </div>
                            </div>
                            <div className="card col-md-3 border-0 flex align-items-center ">
                                <div className="card-body card border-0">
                                    Filters: <JqxPanel ref={this.myPanel} theme={"bootstrap"} width={300} height={120} />
                                </div>
                            </div>
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
            const eventData = 'Filter Column: ' + filterinfoItem.filtercolumntext;
            this.myPanel.current!.prepend('<div style="margin-top: 5px;">' + eventData + '</div>');
        }
    };
  /*  private showCustomToolTip(element: any, pageX: any, pageY: any): void{
        const cell = this.myGrid.current!.getcellatposition(pageX, pageY)
        if (cell.column.toString() == "Name") {
            // update tooltip.
            let cellValue = cell.value;
            if (cellValue > availableQuantity) {
                let tooltipContent = "<div style='color: Blue;'>NutSack</div>";
                this.myGrid.current  //jqxTooltip({ content: tooltipContent });
                // open tooltip.
                $("#jqxgrid").jqxTooltip('open', pageX + 15, pageY + 15);
            } else {
                $("#jqxgrid").jqxTooltip('close');
            };
        };

    }*/
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