using Microsoft.EntityFrameworkCore;
using TicketSupport.Domain.Entities;

namespace TicketSupport.Infrastructure.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(
        DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users { get; set; }

    public DbSet<Ticket> Tickets { get; set; }

    public DbSet<Notification> Notifications { get; set; }

    public DbSet<TicketComment> TicketComments { get; set; }

    public DbSet<TicketHistory> TicketHistories { get; set; }
    public DbSet<TicketAttachment> TicketAttachments { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<TicketComment>()
            .HasKey(x => x.CommentId);

        modelBuilder.Entity<TicketHistory>()
            .HasKey(x => x.HistoryId);

        modelBuilder.Entity<TicketAttachment>()
            .HasKey(x => x.AttachmentId);
    }
}