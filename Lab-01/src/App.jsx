import NavBar from "./components/NavBar";
import OrchidList from "./components/OrchidList";
import Footer from "./components/Footer";

function App() {
    return (
        <>
            <NavBar />

            <main>
                <OrchidList />
            </main>

            <Footer />
        </>
    );
}

export default App;