using TicketSupport.Application.DTOs;
using TicketSupport.Application.Interfaces;
using TicketSupport.Domain.Entities;

namespace TicketSupport.Infrastructure.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly JwtService _jwtService;

    public AuthService(
        IUserRepository userRepository,
        JwtService jwtService)
    {
        _userRepository = userRepository;
        _jwtService = jwtService;
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterRequestDto request)
    {
        var existingUser =
            await _userRepository.GetByEmailAsync(request.Email);

        if (existingUser != null)
        {
            return new AuthResponseDto
            {
                Message = "User already exists"
            };
        }

        var user = new User
        {
            Name = request.Name,
            EmployeeId = request.EmployeeId,
            Email = request.Email,
            PhoneNumber = request.PhoneNumber,
            Department = request.Department,
            PasswordHash =
                BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role = request.Role
        };

        await _userRepository.AddAsync(user);
        await _userRepository.SaveChangesAsync();

        return new AuthResponseDto
        {
            Message = "Registration Successful",
            Role = user.Role
        };
    }

    public async Task<AuthResponseDto> LoginAsync(LoginRequestDto request)
    {
        var user =
            await _userRepository.GetByEmailAsync(request.Email);

        if (user == null)
        {
            return new AuthResponseDto
            {
                Message = "Invalid Email"
            };
        }

        bool isValid =
            BCrypt.Net.BCrypt.Verify(
                request.Password,
                user.PasswordHash);

        if (!isValid)
        {
            return new AuthResponseDto
            {
                Message = "Invalid Password"
            };
        }

        if (!user.IsActive)
        {
            return new AuthResponseDto
            {
                Message = "Your account has been disabled. Please contact the administrator."
            };
        }

        var token = _jwtService.GenerateToken(user);

        return new AuthResponseDto
        {
            Message = "Login Successful",
            Token = token,
            Role = user.Role
        };
    }
}