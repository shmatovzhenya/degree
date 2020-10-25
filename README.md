https://community.atlassian.com/t5/Jira-questions/How-to-Import-worklogs-into-Jira-using-CSV/qaq-p/580913

What info do you need for a worklog entry?

1.) which ISSUE is the task the user worked on->issue_key column

2/a worklog entry description
2/b Day of work
2/c time the work started 
2/d user who worked 
2/e work duration (JIRA only accepts in seconds)

the 2.) a+b+c+d+e data is in the "Worklog" column

You can see, the column delimiter is (,), but inside the "Worklog" column the worklog entry data delimiter is (;)

Unfortunately JIRA CSV import documention does not really describes it. 

So the sample CSV below contains the necessary columns for the CSV importer ("pj_name", "pj_type", "pj_key", and "Summary"), and contains the necessary columns for the worklog entry ("issue_key" and "Worklog")

The Summary column contains the summary field text of the ISSUE where you want to import the worklog entry.

issue_key,pj_name,pj type,pj_key,Summary,Worklog
RRIMPF03-10,RR-IMP-F03 RFP,software,RRIMPF03,Summary of the ISSUE,worklog entry description1;2017.11.09 12:30;mlipcsik;3600
RRIMPF03-10,RR-IMP-F03 RFP,software,RRIMPF03,Summary of the ISSUE,worklog entry description2;2017.11.09 13:30;mlipcsik;3600
RRIMPF03-10,RR-IMP-F03 RFP,software,RRIMPF03,Summary of the ISSUE,worklog entry description3;2017.11.09 14:30;mlipcsik;3600
RRIMPF03-10,RR-IMP-F03 RFP,software,RRIMPF03,Summary of the ISSUE,worklog entry description4;2017.11.09 12:30;mlipcsik;3600

 

CSV import steps:

1.) Select the CSV file and [Next] button

2.) Select "Defined in CSV" on the "Import to project" option

3.) Date format is dispayed the system default date format, and you have to use the same format in your CSV. My date format is "yyyy.MM.dd HH:mm", that is why I use "2017.11.09 12:30" in my CSV

[Next] button

4.) JIRA field mapping page, map the fields like this:

CSV field - JIRA field

Summary - Summary

Worklog - Worklog (in seconds)

issue_key - Issue Key

pj type - Project type

pj_key - Project key

pj_name - Project name