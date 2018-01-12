<?php

namespace AVIMetaEditBundle\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class DownloadControllerTest extends WebTestCase
{
    public function testIndex()
    {
        $client = static::createClient();

        $client->request('GET', '/AVIMetaEdit/Download');
        $this->assertEquals(200, $client->getResponse()->getStatusCode());
    }

    public function testArch()
    {
        $client = static::createClient();

        $client->request('GET', '/AVIMetaEdit/Download/Arch_Linux');
        $this->assertEquals(200, $client->getResponse()->getStatusCode());
    }

    public function testCentos()
    {
        $client = static::createClient();

        $client->request('GET', '/AVIMetaEdit/Download/CentOS');
        $this->assertEquals(200, $client->getResponse()->getStatusCode());
    }

    public function testDebian()
    {
        $client = static::createClient();

        $client->request('GET', '/AVIMetaEdit/Download/Debian');
        $this->assertEquals(200, $client->getResponse()->getStatusCode());
    }

    public function testFedora()
    {
        $client = static::createClient();

        $client->request('GET', '/AVIMetaEdit/Download/Fedora');
        $this->assertEquals(200, $client->getResponse()->getStatusCode());
    }

    public function testFlatpak()
    {
        $client = static::createClient();

        $client->request('GET', '/AVIMetaEdit/Download/Flatpak');
        $this->assertEquals(200, $client->getResponse()->getStatusCode());
    }

    public function testMac()
    {
        $client = static::createClient();

        $client->request('GET', '/AVIMetaEdit/Download/Mac_OS');
        $this->assertEquals(200, $client->getResponse()->getStatusCode());
    }

    public function testMageia()
    {
        $client = static::createClient();

        $client->request('GET', '/AVIMetaEdit/Download/Mageia');
        $this->assertEquals(200, $client->getResponse()->getStatusCode());
    }

    public function testOpensuse()
    {
        $client = static::createClient();

        $client->request('GET', '/AVIMetaEdit/Download/openSUSE');
        $this->assertEquals(200, $client->getResponse()->getStatusCode());
    }

    public function testRhel()
    {
        $client = static::createClient();

        $client->request('GET', '/AVIMetaEdit/Download/RHEL');
        $this->assertEquals(200, $client->getResponse()->getStatusCode());
    }

    public function testSle()
    {
        $client = static::createClient();

        $client->request('GET', '/AVIMetaEdit/Download/SLE');
        $this->assertEquals(200, $client->getResponse()->getStatusCode());
    }

    public function testSource()
    {
        $client = static::createClient();

        $client->request('GET', '/AVIMetaEdit/Download/Source');
        $this->assertEquals(200, $client->getResponse()->getStatusCode());
    }

    public function testUbuntu()
    {
        $client = static::createClient();

        $client->request('GET', '/AVIMetaEdit/Download/Ubuntu');
        $this->assertEquals(200, $client->getResponse()->getStatusCode());
    }

    public function testWindows()
    {
        $client = static::createClient();

        $client->request('GET', '/AVIMetaEdit/Download/Windows');
        $this->assertEquals(200, $client->getResponse()->getStatusCode());
    }
}
