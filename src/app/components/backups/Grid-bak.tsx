import * as React from 'react';
import * as ReactDOM from 'react-dom';
import JqxButton from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxbuttons';
import JqxListBox, { IListBoxProps } from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxlistbox';
import JqxGrid, { IGridProps, jqx } from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxgrid';
export interface IState extends IGridProps {
    listBoxSource: IListBoxProps['source'];
}
interface IMyProps {
    columns: any,
    rows: any
    innerRows: any
}
class Grid extends React.PureComponent<{}, IState, IMyProps> {
    private myGrid = React.createRef<JqxGrid>();
    constructor(props: IMyProps) {
        super(props);
        const source: any =
            {
                datafields: [
                    { name: 'school_name', type: 'string', map: '1' },
                    { name: 'interview_req', type: 'bool', map: '2' },
                    { name: 'lor_num', type: 'number', map: '3' },
                    { name: 'tuition_in_state_full', type: 'number', map: '4' },
                    { name: 'tuition_out_state_full', type: 'number', map: '5' },
                    { name: 'class_size', type: 'number', map: '6' },
                    { name: 'hours_min', type: 'number', map: '7' },
                    { name: 'program_start_dt', type: 'date', map: '8' },
                    { name: 'ptcas_deadline_dt', type: 'date', map: '9' },
                    { name: 'gpa_prereq_min', type: 'float', map: '10' },
                    { name: 'gpa_overall_min', type: 'float', map: '11' },
                    { name: 'score_verbal_min', type: 'number', map: '12' },
                    { name: 'score_quant_min', type: 'number', map: '13' },
                    { name: 'score_total_min', type: 'number', map: '14' }
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
                    <JqxGrid width={600} height={200} source={nestedGridAdapter} columns={columns} columngroups={columngroups} />,
                    document.getElementById(nestedGridContainer.id)
                );
            }
        };
        this.state = {
            columns: [
                { text: 'Program', datafield: 'school_name', columntype: 'textbox', filtertype: 'input', width: '17%', pinned: true, cellsrenderer: renderer },
                { text: 'Interview', datafield: 'interview_req', columntype: 'checkbox', filtertype: 'bool', threestatecheckbox: true,  width: '6%', },
                { text: 'LOR', datafield: 'lor_num', columntype: 'textbox', width: '4%', cellsrenderer: renderer  },
                { text: 'Tuition (In State)', datafield: 'tuition_in_state_full',  filtertype: 'number', cellsalign: 'right', cellsformat: 'c2', width: '8%', },
                { text: 'Tuition (Out State)', datafield: 'tuition_out_state_full',  filtertype: 'number', cellsalign: 'right', cellsformat: 'c2', width: '8%', },
                { text: 'Class Size.', datafield: 'class_size', filtertype: 'number', cellsalign: 'right', width: '6%', cellsrenderer: renderer  },
                { text: 'Obs Hrs Min.', datafield: 'hours_min', filtertype: 'number', cellsalign: 'right', width: '5%', cellsrenderer: renderer  },
                { text: 'Program Start Date', datafield: 'program_start_dt', filtertype: 'range', cellsalign: 'right', cellsformat: 'd', width: '8%',   },
                { text: 'PTCAS Deadline', datafield: 'ptcas_deadline_dt', filtertype: 'range', cellsalign: 'right', cellsformat: 'd', width: '8%', },
                { text: 'GPA PreReq Min', datafield: 'gpa_prereq_min', filtertype: 'number', cellsalign: 'right', width: '6%', cellsrenderer: renderer  },
                { text: 'GPA Cumulative Min', datafield: 'gpa_overall_min', filtertype: 'number', cellsalign: 'right', width: '6%', cellsrenderer: renderer  },
                { text: 'GRE Verb Min', datafield: 'score_verbal_min', filtertype: 'number', cellsalign: 'right', width: '6%', cellsrenderer: renderer  },
                { text: 'GRE Quant Min', datafield: 'score_quant_min', filtertype: 'number', cellsalign: 'right', width: '6%', cellsrenderer: renderer  },
                { text: 'GRE Total Min', datafield: 'score_total_min', filtertype: 'number', cellsalign: 'right', width: '6%', cellsrenderer: renderer  }
            ],
            listBoxSource: [
                { label: 'Program', value: 'school_name', checked: true },
                { label: 'Interview Type', value: 'interview_req', checked: true },
                { label: 'LOR', value: 'lor_num', checked: true },
                { label: 'Tuition (In State)', value: 'tuition_in_state_full', checked: true },
                { label: 'Tuition (Out State)', value: 'tuition_out_state_full', checked: true },
                { label: 'Class Size', value: 'hours_min', checked: false },
                { label: 'Obs Hrs Min', value: 'type', checked: true },
                { label: 'Program Start Date', value: 'program_start_dt', checked: true },
                { label: 'PTCAS Deadline', value: 'ptcas_deadline_dt', checked: true },
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
        return (
            <div>
                <JqxListBox style={{ float: 'left' }} onCheckChange={this.myListBoxOnCheckChange}
                            width={200} height={200} source={this.state.listBoxSource} checkboxes={true} />
                <JqxGrid ref={this.myGrid}
                    // @ts-ignore
                         style={{ float: 'left', marginLeft: '20px' }}
                         width={1000} height={365} source={this.state.source} columns={this.state.columns}
                         rowdetails={true} rowsheight={35} initrowdetails={this.state.initrowdetails}
                         //ready={this.state.ready}
                         pageable={true} autoheight={true} sortable={true} altrows={true}
                         enabletooltips={true} editable={false} filterable={true} showfilterrow={true} selectionmode={'multiplecellsadvanced'}
                         columnsresize={true}
                         rowdetailstemplate={this.state.rowdetailstemplate}
                />
                <br />
                <JqxButton onClick={this.clearFiltering} width={100} height={20}>Remove Filter</JqxButton>
            </div>
        );
    }
    private clearFiltering(): void {
        this.myGrid.current!.clearfilters();
    };
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