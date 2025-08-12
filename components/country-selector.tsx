"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

const countries = [
  { value: "AF", label: "Afghanistan", flag: "🇦🇫" },
  { value: "AL", label: "Albania", flag: "🇦🇱" },
  { value: "DZ", label: "Algeria", flag: "🇩🇿" },
  { value: "AS", label: "American Samoa", flag: "🇦🇸" },
  { value: "AD", label: "Andorra", flag: "🇦🇩" },
  { value: "AO", label: "Angola", flag: "🇦🇴" },
  { value: "AI", label: "Anguilla", flag: "🇦🇮" },
  { value: "AQ", label: "Antarctica", flag: "🇦🇶" },
  { value: "AG", label: "Antigua and Barbuda", flag: "🇦🇬" },
  { value: "AR", label: "Argentina", flag: "🇦🇷" },
  { value: "AM", label: "Armenia", flag: "🇦🇲" },
  { value: "AW", label: "Aruba", flag: "🇦🇼" },
  { value: "AU", label: "Australia", flag: "🇦🇺" },
  { value: "AT", label: "Austria", flag: "🇦🇹" },
  { value: "AZ", label: "Azerbaijan", flag: "🇦🇿" },
  { value: "BS", label: "Bahamas", flag: "🇧🇸" },
  { value: "BH", label: "Bahrain", flag: "🇧🇭" },
  { value: "BD", label: "Bangladesh", flag: "🇧🇩" },
  { value: "BB", label: "Barbados", flag: "🇧🇧" },
  { value: "BY", label: "Belarus", flag: "🇧🇾" },
  { value: "BE", label: "Belgium", flag: "🇧🇪" },
  { value: "BZ", label: "Belize", flag: "🇧🇿" },
  { value: "BJ", label: "Benin", flag: "🇧🇯" },
  { value: "BM", label: "Bermuda", flag: "🇧🇲" },
  { value: "BT", label: "Bhutan", flag: "🇧🇹" },
  { value: "BO", label: "Bolivia", flag: "🇧🇴" },
  { value: "BA", label: "Bosnia and Herzegovina", flag: "🇧🇦" },
  { value: "BW", label: "Botswana", flag: "🇧🇼" },
  { value: "BV", label: "Bouvet Island", flag: "🇧🇻" },
  { value: "BR", label: "Brazil", flag: "🇧🇷" },
  { value: "IO", label: "British Indian Ocean Territory", flag: "🇮🇴" },
  { value: "BN", label: "Brunei Darussalam", flag: "🇧🇳" },
  { value: "BG", label: "Bulgaria", flag: "🇧🇬" },
  { value: "BF", label: "Burkina Faso", flag: "🇧🇫" },
  { value: "BI", label: "Burundi", flag: "🇧🇮" },
  { value: "KH", label: "Cambodia", flag: "🇰🇭" },
  { value: "CM", label: "Cameroon", flag: "🇨🇲" },
  { value: "CA", label: "Canada", flag: "🇨🇦" },
  { value: "CV", label: "Cape Verde", flag: "🇨🇻" },
  { value: "KY", label: "Cayman Islands", flag: "🇰🇾" },
  { value: "CF", label: "Central African Republic", flag: "🇨🇫" },
  { value: "TD", label: "Chad", flag: "🇹🇩" },
  { value: "CL", label: "Chile", flag: "🇨🇱" },
  { value: "CN", label: "China", flag: "🇨🇳" },
  { value: "CX", label: "Christmas Island", flag: "🇨🇽" },
  { value: "CC", label: "Cocos (Keeling) Islands", flag: "🇨🇨" },
  { value: "CO", label: "Colombia", flag: "🇨🇴" },
  { value: "KM", label: "Comoros", flag: "🇰🇲" },
  { value: "CG", label: "Congo", flag: "🇨🇬" },
  { value: "CD", label: "Congo, Democratic Republic", flag: "🇨🇩" },
  { value: "CK", label: "Cook Islands", flag: "🇨🇰" },
  { value: "CR", label: "Costa Rica", flag: "🇨🇷" },
  { value: "CI", label: "Cote D'Ivoire", flag: "🇨🇮" },
  { value: "HR", label: "Croatia", flag: "🇭🇷" },
  { value: "CU", label: "Cuba", flag: "🇨🇺" },
  { value: "CY", label: "Cyprus", flag: "🇨🇾" },
  { value: "CZ", label: "Czech Republic", flag: "🇨🇿" },
  { value: "DK", label: "Denmark", flag: "🇩🇰" },
  { value: "DJ", label: "Djibouti", flag: "🇩🇯" },
  { value: "DM", label: "Dominica", flag: "🇩🇲" },
  { value: "DO", label: "Dominican Republic", flag: "🇩🇴" },
  { value: "EC", label: "Ecuador", flag: "🇪🇨" },
  { value: "EG", label: "Egypt", flag: "🇪🇬" },
  { value: "SV", label: "El Salvador", flag: "🇸🇻" },
  { value: "GQ", label: "Equatorial Guinea", flag: "🇬🇶" },
  { value: "ER", label: "Eritrea", flag: "🇪🇷" },
  { value: "EE", label: "Estonia", flag: "🇪🇪" },
  { value: "ET", label: "Ethiopia", flag: "🇪🇹" },
  { value: "FK", label: "Falkland Islands (Malvinas)", flag: "🇫🇰" },
  { value: "FO", label: "Faroe Islands", flag: "🇫🇴" },
  { value: "FJ", label: "Fiji", flag: "🇫🇯" },
  { value: "FI", label: "Finland", flag: "🇫🇮" },
  { value: "FR", label: "France", flag: "🇫🇷" },
  { value: "GF", label: "French Guiana", flag: "🇬🇫" },
  { value: "PF", label: "French Polynesia", flag: "🇵🇫" },
  { value: "TF", label: "French Southern Territories", flag: "🇹🇫" },
  { value: "GA", label: "Gabon", flag: "🇬🇦" },
  { value: "GM", label: "Gambia", flag: "🇬🇲" },
  { value: "GE", label: "Georgia", flag: "🇬🇪" },
  { value: "DE", label: "Germany", flag: "🇩🇪" },
  { value: "GH", label: "Ghana", flag: "🇬🇭" },
  { value: "GI", label: "Gibraltar", flag: "🇬🇮" },
  { value: "GR", label: "Greece", flag: "🇬🇷" },
  { value: "GL", label: "Greenland", flag: "🇬🇱" },
  { value: "GD", label: "Grenada", flag: "🇬🇩" },
  { value: "GP", label: "Guadeloupe", flag: "🇬🇵" },
  { value: "GU", label: "Guam", flag: "🇬🇺" },
  { value: "GT", label: "Guatemala", flag: "🇬🇹" },
  { value: "GG", label: "Guernsey", flag: "🇬🇬" },
  { value: "GN", label: "Guinea", flag: "🇬🇳" },
  { value: "GW", label: "Guinea-Bissau", flag: "🇬🇼" },
  { value: "GY", label: "Guyana", flag: "🇬🇾" },
  { value: "HT", label: "Haiti", flag: "🇭🇹" },
  { value: "HM", label: "Heard Island & Mcdonald Islands", flag: "🇭🇲" },
  { value: "VA", label: "Holy See (Vatican City State)", flag: "🇻🇦" },
  { value: "HN", label: "Honduras", flag: "🇭🇳" },
  { value: "HK", label: "Hong Kong", flag: "🇭🇰" },
  { value: "HU", label: "Hungary", flag: "🇭🇺" },
  { value: "IS", label: "Iceland", flag: "🇮🇸" },
  { value: "IN", label: "India", flag: "🇮🇳" },
  { value: "ID", label: "Indonesia", flag: "🇮🇩" },
  { value: "IR", label: "Iran, Islamic Republic Of", flag: "🇮🇷" },
  { value: "IQ", label: "Iraq", flag: "🇮🇶" },
  { value: "IE", label: "Ireland", flag: "🇮🇪" },
  { value: "IM", label: "Isle Of Man", flag: "🇮🇲" },
  { value: "IL", label: "Israel", flag: "🇮🇱" },
  { value: "IT", label: "Italy", flag: "🇮🇹" },
  { value: "JM", label: "Jamaica", flag: "🇯🇲" },
  { value: "JP", label: "Japan", flag: "🇯🇵" },
  { value: "JE", label: "Jersey", flag: "🇯🇪" },
  { value: "JO", label: "Jordan", flag: "🇯🇴" },
  { value: "KZ", label: "Kazakhstan", flag: "🇰🇿" },
  { value: "KE", label: "Kenya", flag: "🇰🇪" },
  { value: "KI", label: "Kiribati", flag: "🇰🇮" },
  { value: "KR", label: "Korea", flag: "🇰🇷" },
  { value: "KW", label: "Kuwait", flag: "🇰🇼" },
  { value: "KG", label: "Kyrgyzstan", flag: "🇰🇬" },
  { value: "LA", label: "Lao People's Democratic Republic", flag: "🇱🇦" },
  { value: "LV", label: "Latvia", flag: "🇱🇻" },
  { value: "LB", label: "Lebanon", flag: "🇱🇧" },
  { value: "LS", label: "Lesotho", flag: "🇱🇸" },
  { value: "LR", label: "Liberia", flag: "🇱🇷" },
  { value: "LY", label: "Libyan Arab Jamahiriya", flag: "🇱🇾" },
  { value: "LI", label: "Liechtenstein", flag: "🇱🇮" },
  { value: "LT", label: "Lithuania", flag: "🇱🇹" },
  { value: "LU", label: "Luxembourg", flag: "🇱🇺" },
  { value: "MO", label: "Macao", flag: "🇲🇴" },
  { value: "MK", label: "Macedonia", flag: "🇲🇰" },
  { value: "MG", label: "Madagascar", flag: "🇲🇬" },
  { value: "MW", label: "Malawi", flag: "🇲🇼" },
  { value: "MY", label: "Malaysia", flag: "🇲🇾" },
  { value: "MV", label: "Maldives", flag: "🇲🇻" },
  { value: "ML", label: "Mali", flag: "🇲🇱" },
  { value: "MT", label: "Malta", flag: "🇲🇹" },
  { value: "MH", label: "Marshall Islands", flag: "🇲🇭" },
  { value: "MQ", label: "Martinique", flag: "🇲🇶" },
  { value: "MR", label: "Mauritania", flag: "🇲🇷" },
  { value: "MU", label: "Mauritius", flag: "🇲🇺" },
  { value: "YT", label: "Mayotte", flag: "🇾🇹" },
  { value: "MX", label: "Mexico", flag: "🇲🇽" },
  { value: "FM", label: "Micronesia, Federated States Of", flag: "🇫🇲" },
  { value: "MD", label: "Moldova", flag: "🇲🇩" },
  { value: "MC", label: "Monaco", flag: "🇲🇨" },
  { value: "MN", label: "Mongolia", flag: "🇲🇳" },
  { value: "ME", label: "Montenegro", flag: "🇲🇪" },
  { value: "MS", label: "Montserrat", flag: "🇲🇸" },
  { value: "MA", label: "Morocco", flag: "🇲🇦" },
  { value: "MZ", label: "Mozambique", flag: "🇲🇿" },
  { value: "MM", label: "Myanmar", flag: "🇲🇲" },
  { value: "NA", label: "Namibia", flag: "🇳🇦" },
  { value: "NR", label: "Nauru", flag: "🇳🇷" },
  { value: "NP", label: "Nepal", flag: "🇳🇵" },
  { value: "NL", label: "Netherlands", flag: "🇳🇱" },
  { value: "AN", label: "Netherlands Antilles", flag: "🇦🇳" },
  { value: "NC", label: "New Caledonia", flag: "🇳🇨" },
  { value: "NZ", label: "New Zealand", flag: "🇳🇿" },
  { value: "NI", label: "Nicaragua", flag: "🇳🇮" },
  { value: "NE", label: "Niger", flag: "🇳🇪" },
  { value: "NG", label: "Nigeria", flag: "🇳🇬" },
  { value: "NU", label: "Niue", flag: "🇳🇺" },
  { value: "NF", label: "Norfolk Island", flag: "🇳🇫" },
  { value: "MP", label: "Northern Mariana Islands", flag: "🇲🇵" },
  { value: "NO", label: "Norway", flag: "🇳🇴" },
  { value: "OM", label: "Oman", flag: "🇴🇲" },
  { value: "PK", label: "Pakistan", flag: "🇵🇰" },
  { value: "PW", label: "Palau", flag: "🇵🇼" },
  { value: "PS", label: "Palestinian Territory, Occupied", flag: "🇵🇸" },
  { value: "PA", label: "Panama", flag: "🇵🇦" },
  { value: "PG", label: "Papua New Guinea", flag: "🇵🇬" },
  { value: "PY", label: "Paraguay", flag: "🇵🇾" },
  { value: "PE", label: "Peru", flag: "🇵🇪" },
  { value: "PH", label: "Philippines", flag: "🇵🇭" },
  { value: "PN", label: "Pitcairn", flag: "🇵🇳" },
  { value: "PL", label: "Poland", flag: "🇵🇱" },
  { value: "PT", label: "Portugal", flag: "🇵🇹" },
  { value: "PR", label: "Puerto Rico", flag: "🇵🇷" },
  { value: "QA", label: "Qatar", flag: "🇶🇦" },
  { value: "RE", label: "Reunion", flag: "🇷🇪" },
  { value: "RO", label: "Romania", flag: "🇷🇴" },
  { value: "RU", label: "Russian Federation", flag: "🇷🇺" },
  { value: "RW", label: "Rwanda", flag: "🇷🇼" },
  { value: "BL", label: "Saint Barthelemy", flag: "🇧🇱" },
  { value: "SH", label: "Saint Helena", flag: "🇸🇭" },
  { value: "KN", label: "Saint Kitts And Nevis", flag: "🇰🇳" },
  { value: "LC", label: "Saint Lucia", flag: "🇱🇨" },
  { value: "MF", label: "Saint Martin", flag: "🇲🇫" },
  { value: "PM", label: "Saint Pierre And Miquelon", flag: "🇵🇲" },
  { value: "VC", label: "Saint Vincent And Grenadines", flag: "🇻🇨" },
  { value: "WS", label: "Samoa", flag: "🇼🇸" },
  { value: "SM", label: "San Marino", flag: "🇸🇲" },
  { value: "ST", label: "Sao Tome And Principe", flag: "🇸🇹" },
  { value: "SA", label: "Saudi Arabia", flag: "🇸🇦" },
  { value: "SN", label: "Senegal", flag: "🇸🇳" },
  { value: "RS", label: "Serbia", flag: "🇷🇸" },
  { value: "SC", label: "Seychelles", flag: "🇸🇨" },
  { value: "SL", label: "Sierra Leone", flag: "🇸🇱" },
  { value: "SG", label: "Singapore", flag: "🇸🇬" },
  { value: "SK", label: "Slovakia", flag: "🇸🇰" },
  { value: "SI", label: "Slovenia", flag: "🇸🇮" },
  { value: "SB", label: "Solomon Islands", flag: "🇸🇧" },
  { value: "SO", label: "Somalia", flag: "🇸🇴" },
  { value: "ZA", label: "South Africa", flag: "🇿🇦" },
  { value: "GS", label: "South Georgia And Sandwich Isl.", flag: "🇬🇸" },
  { value: "ES", label: "Spain", flag: "🇪🇸" },
  { value: "LK", label: "Sri Lanka", flag: "🇱🇰" },
  { value: "SD", label: "Sudan", flag: "🇸🇩" },
  { value: "SR", label: "Suriname", flag: "🇸🇷" },
  { value: "SJ", label: "Svalbard And Jan Mayen", flag: "🇸🇯" },
  { value: "SZ", label: "Swaziland", flag: "🇸🇿" },
  { value: "SE", label: "Sweden", flag: "🇸🇪" },
  { value: "CH", label: "Switzerland", flag: "🇨🇭" },
  { value: "SY", label: "Syrian Arab Republic", flag: "🇸🇾" },
  { value: "TW", label: "Taiwan", flag: "🇹🇼" },
  { value: "TJ", label: "Tajikistan", flag: "🇹🇯" },
  { value: "TZ", label: "Tanzania", flag: "🇹🇿" },
  { value: "TH", label: "Thailand", flag: "🇹🇭" },
  { value: "TL", label: "Timor-Leste", flag: "🇹🇱" },
  { value: "TG", label: "Togo", flag: "🇹🇬" },
  { value: "TK", label: "Tokelau", flag: "🇹🇰" },
  { value: "TO", label: "Tonga", flag: "🇹🇴" },
  { value: "TT", label: "Trinidad And Tobago", flag: "🇹🇹" },
  { value: "TN", label: "Tunisia", flag: "🇹🇳" },
  { value: "TR", label: "Turkey", flag: "🇹🇷" },
  { value: "TM", label: "Turkmenistan", flag: "🇹🇲" },
  { value: "TC", label: "Turks And Caicos Islands", flag: "🇹🇨" },
  { value: "TV", label: "Tuvalu", flag: "🇹🇻" },
  { value: "UG", label: "Uganda", flag: "🇺🇬" },
  { value: "UA", label: "Ukraine", flag: "🇺🇦" },
  { value: "AE", label: "United Arab Emirates", flag: "🇦🇪" },
  { value: "GB", label: "United Kingdom", flag: "🇬🇧" },
  { value: "US", label: "United States", flag: "🇺🇸" },
  { value: "UM", label: "United States Outlying Islands", flag: "🇺🇲" },
  { value: "UY", label: "Uruguay", flag: "🇺🇾" },
  { value: "UZ", label: "Uzbekistan", flag: "🇺🇿" },
  { value: "VU", label: "Vanuatu", flag: "🇻🇺" },
  { value: "VE", label: "Venezuela", flag: "🇻🇪" },
  { value: "VN", label: "Viet Nam", flag: "🇻🇳" },
  { value: "VG", label: "Virgin Islands, British", flag: "🇻🇬" },
  { value: "VI", label: "Virgin Islands, U.S.", flag: "🇻🇮" },
  { value: "WF", label: "Wallis And Futuna", flag: "🇼🇫" },
  { value: "EH", label: "Western Sahara", flag: "🇪🇭" },
  { value: "YE", label: "Yemen", flag: "🇾🇪" },
  { value: "ZM", label: "Zambia", flag: "🇿🇲" },
  { value: "ZW", label: "Zimbabwe", flag: "🇿🇼" },
]

interface CountrySelectorProps {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  className?: string
}

export function CountrySelector({
  value,
  onValueChange,
  placeholder = "Select country...",
  className,
}: CountrySelectorProps) {
  const [open, setOpen] = React.useState(false)

  const selectedCountry = countries.find((country) => country.value === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between bg-[#162040] border-[#253256] text-white hover:bg-[#253256]",
            className,
          )}
        >
          {selectedCountry ? (
            <div className="flex items-center">
              <span className="mr-2">{selectedCountry.flag}</span>
              {selectedCountry.label}
            </div>
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 bg-[#0a1735] border-[#253256]">
        <Command className="bg-[#0a1735]">
          <CommandInput placeholder="Search country..." className="bg-[#162040] border-[#253256] text-white" />
          <CommandList>
            <CommandEmpty className="text-gray-400">No country found.</CommandEmpty>
            <CommandGroup>
              {countries.map((country) => (
                <CommandItem
                  key={country.value}
                  value={country.value}
                  onSelect={(currentValue) => {
                    onValueChange?.(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                  className="text-white hover:bg-[#253256] cursor-pointer"
                >
                  <Check className={cn("mr-2 h-4 w-4", value === country.value ? "opacity-100" : "opacity-0")} />
                  <span className="mr-2">{country.flag}</span>
                  {country.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
