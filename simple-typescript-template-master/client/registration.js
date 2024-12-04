document.addEventListener('DOMContentLoaded', () => {
  const signupForm = document.getElementById('registrationForm')
 
  signupForm.addEventListener('submit', async (event) => {
    event.preventDefault()
 
    const username = document.getElementById('username').value
    const password = document.getElementById('password').value
 
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })
 
    const data = await response.text()
 
    if (response.status === 200) {
      alert(data)
      window.location.href = '/login' 
    } else {
      alert(data)
      alert(`Error: ${data.error}`)
    }
  })
})
 