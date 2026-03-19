import { CreateButton } from '@/components/refine-ui/buttons/create'
import { DataTable } from '@/components/refine-ui/data-table/data-table'
import { Breadcrumb } from '@/components/refine-ui/layout/breadcrumb'
import { ListView } from '@/components/refine-ui/views/list-view'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BACKEND_BASE_URL, DEPARTEMENT_OPTIONS } from '@/constants'
import { ClassDetails, Subject, User } from '@/types'
import { useTable } from '@refinedev/react-table'
import { ColumnDef } from '@tanstack/react-table'

import { Search } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
//class list page
const ClassesLists = () => {
  
  const [searchQuery,setSearchQuery] = useState('')
  const [selectedDepartement, setselectedDepartement] = useState('all')
  const [selectedSubject, setSelectedSubject] = useState('all')
  const [selectedTeacher, setSelectedTeacher] = useState('all')

  const [subjects, setSubjects] = useState<Subject[]>([])
  const [teachers, setTeachers] = useState<User[]>([])

  const departementFilters = selectedDepartement === 'all' ? [] : [
    {
      field:'department',
      operator:'eq' as const,
      value:selectedDepartement
    }
  ]
  const searchFilters = searchQuery === '' ? [] : [
    {
      field:'name',
      operator:'contains' as const,
      value:searchQuery
    }
  ]

  const subjectFilters =
    selectedSubject === 'all'
      ? []
      : [
          {
            field: 'subject',
            operator: 'eq' as const,
            value: selectedSubject,
          },
        ]

  const teacherFilters =
    selectedTeacher === 'all'
      ? []
      : [
          {
            field: 'teacher',
            operator: 'eq' as const,
            value: selectedTeacher,
          },
        ]

  useEffect(() => {
    const controller = new AbortController();

    const loadDropdownOptions = async () => {
      try {
        const [subjectsResponse, teachersResponse] = await Promise.all([
          fetch(`${BACKEND_BASE_URL}/subjects?limit=100`, { signal: controller.signal }),
          fetch(`${BACKEND_BASE_URL}/users?role=teacher&limit=100`, { signal: controller.signal }),
        ]);

        if (!subjectsResponse.ok || !teachersResponse.ok) {
          throw new Error('Failed to load subject/teacher dropdown options.');
        }

        const subjectsPayload = await subjectsResponse.json();
        const teachersPayload = await teachersResponse.json();

        setSubjects(subjectsPayload.data ?? []);
        setTeachers(teachersPayload.data ?? []);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Error loading dropdown options:', err);
        }
      }
    };

    void loadDropdownOptions();
    return () => controller.abort();
  }, []);
  const classesTable = useTable<ClassDetails>({
    columns:useMemo<ColumnDef<ClassDetails>[]>(()=> [
      {
        id:'subject',
        accessorKey:'subject.name',
        size:180,
        header:() =><p className='column-title ml-2'>Subject</p>,
        cell:({getValue}) => <span className='ml-2'>{getValue<string>() ?? '-'}</span>
      },
      {
        id:'teacher',
        accessorKey:'teacher.name',
        size:180,
        header:() =><p className='column-title ml-2'>Teacher</p>,
        cell:({getValue}) => <span className='ml-2'>{getValue<string>() ?? '-'}</span>
      },
      {
        id:'capacity',
        accessorKey:'capacity',
        size:100,
        header:() =><p className='column-title ml-2'>Capacity</p>,
        cell:({getValue}) => <Badge className='ml-2'>{getValue<number>()}</Badge>
      },
      {
        id:'banner',
        accessorKey:'bannerUrl',
        size:140,
        header:() =><p className='column-title ml-2'>Banner</p>,
        cell:({getValue}) => {
          const url = getValue<string | undefined>();
          return url ? (
            <img
              className="ml-2 h-12 w-16 rounded object-cover"
              src={url}
              alt="Class banner"
            />
          ) : (
            <span className="ml-2 text-muted-foreground">-</span>
          );
        },
      },
       {
        id:'name',
        accessorKey:'name',
        size:100,
        header:() =><p className='column-title ml-2'>Name</p>,
        cell:({getValue}) => <span className='ml-2'>{getValue<string>()}</span>,
        filterFn: 'includesString' // Use the built-in string filter function
      },
       {
        id:'department',
        accessorKey:'department.name',
        size:150,
        header:() =><p className='column-title ml-2'>Departement</p>,
        cell:({getValue}) => <Badge variant="secondary" className='ml-2'>{getValue<string>() ?? '-'}</Badge>
      },
       {
        id:'description',
        accessorKey:'description',
        size:300,
        header:() =><p className='column-title ml-2'>Description</p>,
        cell:({getValue}) => <span className='truncate line-clamp-2 ml-2'>{getValue<string>()}</span>
      }
    ],[]),
    refineCoreProps: {
      resource:'classes',
      pagination:{pageSize:10,mode:'server'},
      filters:{
        permanent:[...departementFilters, ...subjectFilters, ...teacherFilters, ...searchFilters]
      },
      sorters:{
        initial:[
          {field:'id', order:'desc'} ]
      },

    }

  })
  return (
    
    <ListView>
      <Breadcrumb />

      <h1 className='page-title'>Classes</h1>
      <div className='intro-row'>
        <p>Quick access to esential metrics and management tools</p>
        <div className='actions-row'>
          <div className='search-field'>
            <Search className='search-icon'/>
            <Input 
              type="text"
              placeholder='Search by name'
              className='pl-10 w-full' 
              value={searchQuery}  
              onChange={(e)=> setSearchQuery(e.target.value)}         />
          </div>
          <div className='flex gap-2 w-full sm:w-auto'>
            <Select value={selectedDepartement} onValueChange={setselectedDepartement}>
              <SelectTrigger>
                <SelectValue placeholder='Placed by Filter ...'/> 
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All"> All Departements</SelectItem>
           
               {DEPARTEMENT_OPTIONS.map(departement => (
                <SelectItem key={departement.value} value={departement.value}>
                  {departement.label}
                </SelectItem>
              ))}
            </SelectContent> 
            </Select>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger>
                <SelectValue placeholder="All subjects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map((s) => (
                  <SelectItem key={s.id} value={s.name}>
                    {s.name}({s.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
              <SelectTrigger>
                <SelectValue placeholder="All teachers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Teachers</SelectItem>
                {teachers.map((t) => (
                  <SelectItem key={t.id} value={t.name}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <CreateButton />
          </div>


        </div>

      </div>
      <DataTable table ={classesTable}/>
    </ListView>
  )
}

export default ClassesLists






  

