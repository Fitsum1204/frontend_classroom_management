import { CreateButton } from '@/components/refine-ui/buttons/create'
import { DataTable } from '@/components/refine-ui/data-table/data-table'
import { Breadcrumb } from '@/components/refine-ui/layout/breadcrumb'
import { ListView } from '@/components/refine-ui/views/list-view'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DEPARTEMENT_OPTIONS} from '@/constants'
import { Subject } from '@/types'
import { useTable } from '@refinedev/react-table'
import { ColumnDef } from '@tanstack/react-table'

import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'

const Subjectslist = () => {

  const [searchQuery,setSearchQuery] = useState('')
  const [selectedDepartement, setselectedDepartement] = useState('all')

  const departementFilters = selectedDepartement === 'all' ? [] : [
    {
      field:'departement',
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
  const subjectTable = useTable<Subject>({
    columns:useMemo<ColumnDef<Subject>[]>(()=> [
      {
        id:'code',
        accessorKey:'code',
        size:100,
        header:() =><p className='column-title ml-2'>Code</p>,
        cell:({getValue}) => <Badge className='ml-2'>{getValue<string>()}</Badge>
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
        id:'departement',
        accessorKey:'departement',
        size:150,
        header:() =><p className='column-title ml-2'>Departement</p>,
        cell:({getValue}) => <Badge variant="secondary" className='ml-2'>{getValue<string>()}</Badge>
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
      resource:'subjects',
      pagination:{pageSize:10,mode:'server'},
      filters:{
        permanent:[...departementFilters,...searchFilters]
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

      <h1 className='page-title'>Subjects</h1>
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
           <CreateButton />
          </div>


        </div>

      </div>
      <DataTable table ={subjectTable}/>
    </ListView>
  )
}

export default Subjectslist
