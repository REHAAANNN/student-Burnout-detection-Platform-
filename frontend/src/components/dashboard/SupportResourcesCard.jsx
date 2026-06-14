import { useMemo, useState } from 'react'
import {
  AlertCircle,
  Building2,
  Heart,
  Hospital,
  LocateFixed,
  MapPin,
  Phone,
  Search,
  ShieldAlert,
  Users
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'

const campusLocation = 'GEHU Main Building, Second Floor Counselling Room'

const buildMapLink = (query) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`

const buildNearbyResults = (locationText) => {
  const baseLocation = locationText || 'near me'
  const categories = [
    ['Therapists', 'Licensed therapist'],
    ['Counselors', 'Mental health counselor'],
    ['Mental Health Clinics', 'Mental health clinic'],
    ['Support Centers', 'Student mental health support center']
  ]

  return categories.map(([category, name]) => ({
    category,
    name: `${name} near ${baseLocation}`,
    address: `Search results for ${category.toLowerCase()} in ${baseLocation}`,
    distance: 'Open in Maps',
    contact: 'See listed phone number',
    mapLink: buildMapLink(`${category} ${baseLocation}`)
  }))
}

export const SupportResourcesCard = ({ riskLevel = 'Low Risk' }) => {
  const [activeModal, setActiveModal] = useState(null)
  const [city, setCity] = useState('')
  const [pincode, setPincode] = useState('')
  const [locationText, setLocationText] = useState('')
  const [isLocating, setIsLocating] = useState(false)

  const isHighRisk = riskLevel?.toLowerCase().includes('high')

  const nearbyResults = useMemo(
    () => buildNearbyResults(locationText || [city, pincode].filter(Boolean).join(' ')),
    [city, pincode, locationText]
  )

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationText('current location')
      return
    }

    setIsLocating(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setLocationText(`${latitude},${longitude}`)
        setIsLocating(false)
      },
      () => {
        setLocationText('current location')
        setIsLocating(false)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  return (
    <>
      <Card className={isHighRisk ? 'border-danger-200 bg-danger-50/40 dark:border-danger-900/50 dark:bg-danger-900/10' : ''}>
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardTitle>Support Resources</CardTitle>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Campus, local, and urgent support options</p>
            </div>
            {isHighRisk && (
              <span className="inline-flex items-center gap-1 rounded-full bg-danger-100 px-3 py-1 text-xs font-bold text-danger-700 dark:bg-danger-900/40 dark:text-danger-200">
                <ShieldAlert className="h-3.5 w-3.5" />
                High priority
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-200">
                  <Users className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-gray-950 dark:text-white">Campus Mental Health Counselor</h4>
                  <div className="mt-2 space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    <p>Ms. Muskan Jaggi</p>
                    <p>Mental Health Counsellor</p>
                    <p>Available: Monday to Saturday</p>
                    <p>Location: Second Floor, Counselling Room, GEHU Main Building</p>
                  </div>
                  <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                    Professional mental health counseling support available for students on campus.
                  </p>
                  <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                    <Button size="sm" onClick={() => setActiveModal('campus')}>Book Visit</Button>
                    <a href={buildMapLink(campusLocation)} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center rounded-lg border-2 border-primary-600 px-3 py-1.5 text-sm font-medium text-primary-600 transition-colors hover:bg-primary-50">
                      <MapPin className="mr-2 h-4 w-4" />
                      View Location
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveModal('nearby')}
              className="w-full rounded-xl border border-gray-200 p-4 text-left transition-shadow hover:shadow-soft dark:border-gray-700"
            >
              <div className="flex items-start gap-3">
                <Heart className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary-600" />
                <div>
                  <h4 className="font-semibold text-gray-950 dark:text-white">Mental Health Resources</h4>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Find nearby therapists, counselors, clinics, and support centers.
                  </p>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setActiveModal('emergency')}
              className={`w-full rounded-xl border p-4 text-left transition-shadow hover:shadow-soft ${
                isHighRisk
                  ? 'border-danger-300 bg-danger-50 dark:border-danger-900/60 dark:bg-danger-900/20'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-danger-600" />
                <div>
                  <h4 className="font-semibold text-gray-950 dark:text-white">Emergency Support</h4>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Immediate steps, crisis contacts, and nearby hospital search.
                  </p>
                </div>
              </div>
            </button>
          </div>
        </CardContent>
      </Card>

      <Modal isOpen={activeModal === 'campus'} onClose={() => setActiveModal(null)} title="Book Campus Visit" size="lg">
        <div className="space-y-4">
          <div className="rounded-xl bg-primary-50 p-4 dark:bg-primary-900/20">
            <p className="font-semibold text-gray-950 dark:text-white">Ms. Muskan Jaggi</p>
            <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">Mental Health Counsellor, Monday to Saturday</p>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Second Floor, Counselling Room, GEHU Main Building</p>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Visit the counselling room during availability hours or use the location button to navigate there.
          </p>
          <a href={buildMapLink(campusLocation)} target="_blank" rel="noreferrer" className="inline-flex w-full items-center justify-center rounded-lg bg-primary-600 px-4 py-2 font-medium text-white hover:bg-primary-700">
            <MapPin className="mr-2 h-4 w-4" />
            View Location
          </a>
        </div>
      </Modal>

      <Modal isOpen={activeModal === 'nearby'} onClose={() => setActiveModal(null)} title="Find Nearby Mental Health Support" size="xl">
        <div className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              City
              <input value={city} onChange={(event) => setCity(event.target.value)} placeholder="Enter city" className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white" />
            </label>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Pincode
              <input value={pincode} onChange={(event) => setPincode(event.target.value)} placeholder="Enter pincode" className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white" />
            </label>
          </div>
          <Button variant="outline" className="w-full" onClick={useCurrentLocation} isLoading={isLocating}>
            <LocateFixed className="mr-2 h-4 w-4" />
            Use Current Location
          </Button>
          <div className="space-y-3">
            {nearbyResults.map((result) => (
              <div key={result.category} className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
                <div className="flex items-start gap-3">
                  <Building2 className="mt-1 h-5 w-5 flex-shrink-0 text-primary-600" />
                  <div className="flex-1">
                    <p className="text-xs font-bold uppercase text-primary-600 dark:text-primary-300">{result.category}</p>
                    <h4 className="font-semibold text-gray-950 dark:text-white">{result.name}</h4>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{result.address}</p>
                    <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-500 dark:text-gray-400">
                      <span>{result.distance}</span>
                      <span>{result.contact}</span>
                    </div>
                    <a href={result.mapLink} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center text-sm font-semibold text-primary-600 hover:text-primary-700">
                      <Search className="mr-2 h-4 w-4" />
                      Open map search
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>

      <Modal isOpen={activeModal === 'emergency'} onClose={() => setActiveModal(null)} title="Emergency Support" size="xl">
        <div className="space-y-5">
          <div className="rounded-xl border border-danger-200 bg-danger-50 p-4 dark:border-danger-900/50 dark:bg-danger-900/20">
            <h4 className="font-bold text-danger-800 dark:text-danger-100">Immediate Steps</h4>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-danger-800 dark:text-danger-100">
              <li>Contact a trusted friend or family member</li>
              <li>Reach campus counselor</li>
              <li>Seek professional support</li>
              <li>Call emergency helpline if in crisis</li>
            </ol>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <a href="tel:18005990019" className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
              <Phone className="mb-3 h-5 w-5 text-danger-600" />
              <p className="font-semibold text-gray-950 dark:text-white">National helpline</p>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">KIRAN: 1800-599-0019</p>
            </a>
            <a href="tel:112" className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
              <ShieldAlert className="mb-3 h-5 w-5 text-danger-600" />
              <p className="font-semibold text-gray-950 dark:text-white">Campus emergency contact</p>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Emergency response: 112</p>
            </a>
          </div>
          <a href={buildMapLink('nearby hospital')} target="_blank" rel="noreferrer" className="inline-flex w-full items-center justify-center rounded-lg border-2 border-danger-600 px-4 py-2 font-semibold text-danger-700 hover:bg-danger-50 dark:text-danger-300">
            <Hospital className="mr-2 h-4 w-4" />
            Nearby hospital search
          </a>
          <a href="tel:112" className="inline-flex w-full items-center justify-center rounded-lg bg-danger-600 px-4 py-3 font-bold text-white hover:bg-danger-700">
            Need Help Now?
          </a>
        </div>
      </Modal>
    </>
  )
}
