

export default function Footer() {
  return (
    <div>
      <footer className="bg-[#afafda] text-center py-10">
        <div className="container mx-auto">
          <p className="text-gray-600 text-sm">
            &copy; 2024 Real Estate. All rights reserved.
          </p>

          <div className="flex justify-center space-x-5 mt-5">
            <a href="#" className="text-gray-600 hover:text-gray-800 text-sm">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-800 text-sm">
              Terms & Conditions
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-800 text-sm">
              Contact Us
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
