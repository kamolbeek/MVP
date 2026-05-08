using Microsoft.EntityFrameworkCore;
using XalqUchun.API.Models;

namespace XalqUchun.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<MasterProfile> MasterProfiles => Set<MasterProfile>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<MasterCategory> MasterCategories => Set<MasterCategory>();
    public DbSet<Location> Locations => Set<Location>();
    public DbSet<Portfolio> Portfolios => Set<Portfolio>();
    public DbSet<Review> Reviews => Set<Review>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<Payment> Payments => Set<Payment>();
    public DbSet<Chat> Chats => Set<Chat>();
    public DbSet<Message> Messages => Set<Message>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // ── Composite PK for join table ──
        modelBuilder.Entity<MasterCategory>()
            .HasKey(mc => new { mc.MasterId, mc.CategoryId });

        // ── Unique indexes ──
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Phone)
            .IsUnique();

        modelBuilder.Entity<Category>()
            .HasIndex(c => c.Slug)
            .IsUnique();

        // ── User → MasterProfile (1:1) ──
        modelBuilder.Entity<User>()
            .HasOne(u => u.MasterProfile)
            .WithOne(mp => mp.User)
            .HasForeignKey<MasterProfile>(mp => mp.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        // ── User → Location (1:1) ──
        modelBuilder.Entity<User>()
            .HasOne(u => u.Location)
            .WithOne(l => l.User)
            .HasForeignKey<Location>(l => l.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        // ── MasterProfile → Portfolio (1:N) ──
        modelBuilder.Entity<Portfolio>()
            .HasOne(p => p.Master)
            .WithMany(m => m.Portfolio)
            .HasForeignKey(p => p.MasterId)
            .OnDelete(DeleteBehavior.Cascade);

        // ── MasterProfile → Reviews (1:N) ──
        modelBuilder.Entity<Review>()
            .HasOne(r => r.Master)
            .WithMany(m => m.Reviews)
            .HasForeignKey(r => r.MasterId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Review>()
            .HasOne(r => r.Client)
            .WithMany()
            .HasForeignKey(r => r.ClientId)
            .OnDelete(DeleteBehavior.Restrict);

        // ── MasterCategory relationships ──
        modelBuilder.Entity<MasterCategory>()
            .HasOne(mc => mc.Master)
            .WithMany(m => m.Categories)
            .HasForeignKey(mc => mc.MasterId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<MasterCategory>()
            .HasOne(mc => mc.Category)
            .WithMany(c => c.MasterCategories)
            .HasForeignKey(mc => mc.CategoryId)
            .OnDelete(DeleteBehavior.Cascade);

        // ── Order relationships ──
        modelBuilder.Entity<Order>()
            .HasOne(o => o.Client)
            .WithMany(u => u.Orders)
            .HasForeignKey(o => o.ClientId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Order>()
            .HasOne(o => o.Master)
            .WithMany()
            .HasForeignKey(o => o.MasterId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Order>()
            .HasOne(o => o.Category)
            .WithMany()
            .HasForeignKey(o => o.CategoryId)
            .OnDelete(DeleteBehavior.Restrict);

        // ── Order → Payment (1:1) ──
        modelBuilder.Entity<Payment>()
            .HasOne(p => p.Order)
            .WithOne(o => o.Payment)
            .HasForeignKey<Payment>(p => p.OrderId)
            .OnDelete(DeleteBehavior.Cascade);

        // ── Order → Chat (1:1) ──
        modelBuilder.Entity<Chat>()
            .HasOne(c => c.Order)
            .WithOne(o => o.Chat)
            .HasForeignKey<Chat>(c => c.OrderId)
            .OnDelete(DeleteBehavior.Cascade);

        // ── Chat → Users ──
        modelBuilder.Entity<Chat>()
            .HasOne(c => c.Client)
            .WithMany()
            .HasForeignKey(c => c.ClientId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Chat>()
            .HasOne(c => c.Master)
            .WithMany()
            .HasForeignKey(c => c.MasterId)
            .OnDelete(DeleteBehavior.Restrict);

        // ── Chat → Messages (1:N) ──
        modelBuilder.Entity<Message>()
            .HasOne(m => m.Chat)
            .WithMany(c => c.Messages)
            .HasForeignKey(m => m.ChatId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Message>()
            .HasOne(m => m.Sender)
            .WithMany(u => u.SentMessages)
            .HasForeignKey(m => m.SenderId)
            .OnDelete(DeleteBehavior.Restrict);

        // ── Seed Categories ──
        modelBuilder.Entity<Category>().HasData(
            new Category { Id = Guid.Parse("a1b2c3d4-0001-0000-0000-000000000001"), Name = "Santexnik",   Slug = "santexnik",   Icon = "🔧" },
            new Category { Id = Guid.Parse("a1b2c3d4-0002-0000-0000-000000000002"), Name = "Elektrik",    Slug = "elektrik",    Icon = "⚡" },
            new Category { Id = Guid.Parse("a1b2c3d4-0003-0000-0000-000000000003"), Name = "Duradgor",    Slug = "duradgor",    Icon = "🪚" },
            new Category { Id = Guid.Parse("a1b2c3d4-0004-0000-0000-000000000004"), Name = "Dasturchi",   Slug = "dasturchi",   Icon = "💻" },
            new Category { Id = Guid.Parse("a1b2c3d4-0005-0000-0000-000000000005"), Name = "Videograf",   Slug = "videograf",   Icon = "🎥" },
            new Category { Id = Guid.Parse("a1b2c3d4-0006-0000-0000-000000000006"), Name = "Dizayner",    Slug = "dizayner",    Icon = "🎨" },
            new Category { Id = Guid.Parse("a1b2c3d4-0007-0000-0000-000000000007"), Name = "Bo'yoqchi",   Slug = "boyoqchi",    Icon = "🖌️" },
            new Category { Id = Guid.Parse("a1b2c3d4-0008-0000-0000-000000000008"), Name = "Payvandchi",  Slug = "payvandchi",  Icon = "🔩" },
            new Category { Id = Guid.Parse("a1b2c3d4-0009-0000-0000-000000000009"), Name = "Chilangar",   Slug = "chilangar",   Icon = "🔐" },
            new Category { Id = Guid.Parse("a1b2c3d4-0010-0000-0000-000000000010"), Name = "Repetitor",   Slug = "repetitor",   Icon = "📚" }
        );
    }
}
