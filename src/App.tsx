import { useCallback, useState } from 'react';
import AddAppointmentModal from './components/add-appointment';
import AppointmentsTable from './components/appointments-table';
import DashboardLayout from './layouts/DashboardLayout';
import { Filter, Plus, Search} from 'lucide-react';
import { Input } from './components/ui/input';
import { useAppointments } from './contexts/AppointmentContext';
import { Button } from './components/ui/button';
import FilterModal from './components/filter';
import _ from 'lodash';

function App() {

  const { state, dispatch } = useAppointments();
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);

  const debouncedSearch = useCallback(_.debounce((value) => {
    dispatch({ type: "SET_SEARCH_TERM", payload: value })
  }, 500), [dispatch])

  const handleSearchChange = (value: string) => {
    setLocalSearchTerm(value);
    debouncedSearch(value);
  }

  const clearFilters = () => {
    dispatch({ type: "CLEAR_FILTERS" });
  }

  const hasActiveFilters = Object.keys(state.filters).some((key) => {
    const value = state.filters[key as keyof typeof state.filters];
    return Array.isArray(value) ? value.length > 0 : !!value;
  })
  return (
    <DashboardLayout>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
        <div className="flex flex-1 gap-2 items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search"
              value={localSearchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>

          <Button variant="outline" onClick={() => setFilterModalOpen(true)} className="flex items-center gap-2 relative">
            <Filter className="h-4 w-4" />
            {hasActiveFilters && <div className='w-2 h-2 rounded-full bg-red-500 absolute -top-1 -right-1'></div>}
            Add filter
          </Button>

         {hasActiveFilters && <Button variant="ghost" size="sm" onClick={clearFilters}>
            Reset filters
          </Button>}
        </div>

        <Button onClick={() => setAddModalOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add appointment
        </Button>
      </div>

      <AppointmentsTable />

      <FilterModal open={filterModalOpen} onOpenChange={setFilterModalOpen} />
      
      <AddAppointmentModal open={addModalOpen} onOpenChange={setAddModalOpen} />
    </DashboardLayout>
  )
}

export default App
