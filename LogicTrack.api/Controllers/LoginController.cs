using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using LogicTrack.api.Models;
using System.Threading.Tasks;

namespace LogicTrack.api.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class LoginController : ControllerBase
    {
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly UserManager<ApplicationUser> _userManager;

        public LoginController(SignInManager<ApplicationUser> signInManager, UserManager<ApplicationUser> userManager)
        {
            _signInManager = signInManager;
            _userManager = userManager;
        }

        // POST: api/v1/Login
        [HttpPost]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { error = "Invalid form data" });
            }

            var result = await _signInManager.PasswordSignInAsync(model.Username, model.Password, false, false);
            if (result.Succeeded)
            {
                var user = await _userManager.FindByNameAsync(model.Username);
                return Ok(new
                {
                    user = new
                    {
                        username = user.UserName,
                        first_name = user.FirstName,
                        last_name = user.LastName,
                        email = user.Email
                    }
                });
            }

            return BadRequest(new { error = "Invalid credentials" });
        }
    }

    public class LoginModel
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
}