export default function WelcomePage({displayPage}) {
    return (
        <div id="banner">
            <div id="banner_inner">
                <div id="welcome-title" >Cupid</div>
                <div id="welcome-buttons">
                    <input className="button" type="button" value="Login" onClick={() => displayPage("Login")}/>
                    <input className="button" type="button" value="Register" onClick={() => displayPage("Register")}/>
                </div>
            </div>
            <div>Over 90% of Cupid Daters are looking for a serious relationship. Can we introduce you?</div>
            <img width="200" height="150" src="https://media.istockphoto.com/photos/the-cupid-on-the-white-background-picture-id1126475171?b=1&k=20&m=1126475171&s=170667a&w=0&h=2q9ZAnJ17K_GcXuWchUcjSoxelTbAlQHsRjl5-FCycY=" alt="cupid"/>
        </div>
  )
}

