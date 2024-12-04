document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm')
 
  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault() 
 
    const username = document.getElementById('username').value
    const password = document.getElementById('password').value
 
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })
 
      const data = await response.text()
 
      if (response.status === 200) {
        localStorage.setItem('token', data)
        alert('Login Successful')
 
        window.location.href = '/'
      } else {
        const errorMessage = await response.text()
        alert(`Fehler: ${errorMessage}`)
      }
    } catch (error) {
      console.error('Fehler:', error)
      alert(
        'Ein Verbindungsfehler ist aufgetreten. Bitte später erneut versuchen.'
      )
    }
  })
})