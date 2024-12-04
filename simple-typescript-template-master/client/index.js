document.addEventListener('DOMContentLoaded', () => {
    const logoutLink = document.querySelector('a[href="#"]');
    const token = localStorage.getItem('token');
    if (!token) window.location.href = '/login';
    function logout() {
        localStorage.removeItem('token');
       
        window.location.href = '/login';
    }
    
    if (logoutLink) {
        logoutLink.addEventListener('click', (event) => {
            event.preventDefault();
            logout();
        });
    }
 
    const postInput = document.getElementById("postInput") 
    const postButton = document.getElementById("postButton")
    const postList = document.getElementById("postList")
    const createTweet = async () => {
        const content = postInput.value;
        console.log(content);
        const response = await fetch("/api/posts", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ content }),
        });
        const result = await response.text();
        if (response.status === 200) {
            postInput.value = "";
            getTweets()
        }
        else console.log(result);
    };

    const getTweets = async () => {
        const response = await fetch(`/api/posts`, {
            headers: { Authorization: `Bearer ${token}` },
        });
 
        if (response.status === 200) {
            const result = await response.json();
            postList.innerHTML = "";
            result.forEach((post) => {
                postList.innerHTML += `<div class="bg-gray-800 rounded-lg shadow p-4">
                    <div class="flex justify-between items-center">
                        <div>
                            <p class="font-bold">${post.username}</p>
                            <p class="text-sm text-gray-500">2 hours ago</p>
                        </div>
                        <button class="text-gray-500 hover:text-red-500 transition">
                            ❤️ Like
                        </button>
                    </div>
                    <p class="mt-4">
                       ${post.content}
                    </p>
                </div>`
            });
        }
    };

        postButton.addEventListener("click", async () => {
        createTweet();
    });
    getTweets()
});